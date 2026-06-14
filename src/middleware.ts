import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import prisma from '@/lib/prisma'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Allow auth pages and public routes
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/forgot-password') ||
    pathname === '/' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/v1/auth')
  ) {
    if (user && (pathname.startsWith('/login') || pathname.startsWith('/register'))) {
      // Fetch role to redirect correctly
      try {
        // Can't easily use Prisma in edge runtime, we rely on a custom API or we can just redirect to a generic page and let the layout handle role check
        // Or redirect to dashboard by default and dashboard layout kicks out admins
        return NextResponse.redirect(new URL('/dashboard', request.url))
      } catch (e) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }
    return supabaseResponse
  }

  // Protect all other routes
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Role-based protection: The user's role is stored in public.User (managed by Prisma).
  // Ideally, Prisma is not supported in the edge runtime natively unless configured.
  // We'll rely on the server components (layouts) to strictly enforce role limits for now, 
  // or fetch via a Supabase direct query using the REST API if edge is needed.
  // For basic protection, ensuring the user is logged in is sufficient here.

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

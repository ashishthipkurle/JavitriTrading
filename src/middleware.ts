import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

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

  // IMPORTANT: Always call getUser() to refresh the session.
  // Do NOT use getSession() as it doesn't validate the token with the server.
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  const isAuthPage = pathname === '/login' || pathname === '/register';

  if (isAuthPage) {
    if (user) {
      // If user is already logged in, redirect them to /dashboard
      // The middleware will run again for /dashboard and redirect them to /admin or /employee if needed based on their role.
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return supabaseResponse
  }

  // Allow public routes — always pass through
  if (
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/forgot-pin') ||
    pathname === '/' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/auth/callback')
  ) {
    return supabaseResponse
  }

  // --- Protected routes: require authentication ---
  if (!user) {
    // If getUser failed due to a network error but auth cookies exist,
    // allow the request through — layout-level guards will handle it.
    const hasAuthCookies = request.cookies.getAll().some(c => c.name.startsWith('sb-'))
    if (authError && hasAuthCookies) {
      console.error('Middleware getUser() failed but auth cookies present, allowing through:', authError.message)
      return supabaseResponse
    }

    const loginUrl = new URL('/login', request.url)
    const fullPath = pathname + request.nextUrl.search
    loginUrl.searchParams.set('redirectTo', fullPath)
    return NextResponse.redirect(loginUrl)
  }

  // --- Role-based access control ---
  // Query the User table via Supabase REST API to get the role.
  // Uses the service role key to bypass RLS — safe since middleware runs server-side.
  // (Prisma cannot be used in edge middleware runtime)
  const isRoleProtectedRoute =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/employee') ||
    pathname.startsWith('/dashboard')

  if (isRoleProtectedRoute) {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

      const res = await fetch(
        `${supabaseUrl}/rest/v1/User?select=role&id=eq.${user.id}`,
        {
          headers: {
            'apikey': serviceRoleKey,
            'Authorization': `Bearer ${serviceRoleKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.pgrst.object+json', // returns single object
          },
        }
      )

      if (!res.ok) {
        // If role lookup fails, fall through to layout-level guards
        console.error('Middleware role lookup failed:', res.status)
        return supabaseResponse
      }

      const profile = await res.json()

      if (!profile || !profile.role) {
        // User exists in Supabase Auth but not in User table — send to login
        return NextResponse.redirect(new URL('/login', request.url))
      }

      const userRole = profile.role as 'ADMIN' | 'EMPLOYEE' | 'CLIENT'

      // Enforce role-based route access
      if (pathname.startsWith('/admin') && userRole !== 'ADMIN') {
        // Non-admin trying to access admin pages → redirect to their correct dashboard
        const redirectPath = userRole === 'EMPLOYEE' ? '/employee' : '/dashboard'
        return NextResponse.redirect(new URL(redirectPath, request.url))
      }

      if (pathname.startsWith('/employee') && userRole !== 'EMPLOYEE' && userRole !== 'ADMIN') {
        // Non-employee/admin trying to access employee pages → redirect to their dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }

      if (pathname.startsWith('/dashboard')) {
        // Admin and Employee should be redirected to their own dashboards
        if (userRole === 'ADMIN') {
          return NextResponse.redirect(new URL('/admin', request.url))
        }
        if (userRole === 'EMPLOYEE') {
          return NextResponse.redirect(new URL('/employee', request.url))
        }
        // CLIENT users can access /dashboard — pass through
      }
    } catch (e) {
      // If role lookup fails, allow the request through
      // The layout-level guards will act as a safety net
      console.error('Middleware role check failed:', e)
    }
  }

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

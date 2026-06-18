import { createClient } from './supabase/server'
import prisma from './prisma'

export async function getAuthUser() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const profile = await prisma.user.findUnique({
      where: { id: user.id }
    })

    return profile
  } catch (error) {
    console.error('getAuthUser failed:', error instanceof Error ? error.message : error)
    return null
  }
}

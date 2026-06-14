import { PrismaClient, Role, AccountOrigin, KYCStatus, CMSType } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'

const prisma = new PrismaClient()

// Initialize Supabase Admin Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createSupabaseUser(email: string, phone: string, name: string) {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    phone,
    password: 'Password@123',
    email_confirm: true,
    phone_confirm: true,
    user_metadata: { name }
  })

  if (error) {
    if (error.message.includes('already been registered')) {
      // Find existing user if already registered
      const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers()
      const found = existingUser.users.find(u => u.email === email)
      if (found) return found.id
    }
    throw error
  }

  return data.user.id
}

async function main() {
  console.log('Starting seed...')

  // Clean up existing data to avoid unique constraint violations
  await prisma.auditLog.deleteMany()
  await prisma.siteSettings.deleteMany()
  await prisma.fAQ.deleteMany()
  await prisma.testimonial.deleteMany()
  await prisma.video.deleteMany()
  await prisma.landingContent.deleteMany()
  await prisma.withdrawalRequest.deleteMany()
  await prisma.transaction.deleteMany()
  await prisma.commission.deleteMany()
  await prisma.payout.deleteMany()
  await prisma.investment.deleteMany()
  await prisma.fDPlan.deleteMany()
  await prisma.kYC.deleteMany()
  await prisma.user.deleteMany()

  // --- Users ---

  // Admin
  const adminId = await createSupabaseUser('admin@traderfdscheme.com', '+919000000001', 'Admin User')
  const admin = await prisma.user.create({
    data: {
      id: adminId,
      email: 'admin@traderfdscheme.com',
      phone: '+919000000001',
      name: 'Admin User',
      role: Role.ADMIN,
      accountOrigin: AccountOrigin.SELF_REGISTERED,
      kycStatus: KYCStatus.APPROVED,
    },
  })

  // Employees
  const employee1Id = await createSupabaseUser('rahul@traderfdscheme.com', '+919000000002', 'Rahul Sharma')
  const employee1 = await prisma.user.create({
    data: {
      id: employee1Id,
      email: 'rahul@traderfdscheme.com',
      phone: '+919000000002',
      name: 'Rahul Sharma',
      role: Role.EMPLOYEE,
      accountOrigin: AccountOrigin.SELF_REGISTERED,
      kycStatus: KYCStatus.APPROVED,
    },
  })

  const employee2Id = await createSupabaseUser('priya@traderfdscheme.com', '+919000000003', 'Priya Patel')
  const employee2 = await prisma.user.create({
    data: {
      id: employee2Id,
      email: 'priya@traderfdscheme.com',
      phone: '+919000000003',
      name: 'Priya Patel',
      role: Role.EMPLOYEE,
      accountOrigin: AccountOrigin.SELF_REGISTERED,
      kycStatus: KYCStatus.APPROVED,
    },
  })

  // Clients
  const client1Id = await createSupabaseUser('amit@example.com', '+919000000004', 'Amit Kumar')
  const client1 = await prisma.user.create({
    data: {
      id: client1Id,
      email: 'amit@example.com',
      phone: '+919000000004',
      name: 'Amit Kumar',
      role: Role.CLIENT,
      accountOrigin: AccountOrigin.EMPLOYEE_MANAGED,
      managedBy: employee1.id,
      kycStatus: KYCStatus.PENDING,
    },
  })

  const client2Id = await createSupabaseUser('sneha@example.com', '+919000000005', 'Sneha Desai')
  const client2 = await prisma.user.create({
    data: {
      id: client2Id,
      email: 'sneha@example.com',
      phone: '+919000000005',
      name: 'Sneha Desai',
      role: Role.CLIENT,
      accountOrigin: AccountOrigin.EMPLOYEE_MANAGED,
      managedBy: employee2.id,
      kycStatus: KYCStatus.APPROVED,
    },
  })

  const client3Id = await createSupabaseUser('vikram@example.com', '+919000000006', 'Vikram Singh')
  const client3 = await prisma.user.create({
    data: {
      id: client3Id,
      email: 'vikram@example.com',
      phone: '+919000000006',
      name: 'Vikram Singh',
      role: Role.CLIENT,
      accountOrigin: AccountOrigin.SELF_REGISTERED,
      kycStatus: KYCStatus.PENDING,
    },
  })

  // --- FD Plans ---
  const plans = await Promise.all([
    prisma.fDPlan.create({
      data: {
        name: 'Silver Growth',
        description: 'Perfect for beginners looking to start their investment journey.',
        minAmount: 5000,
        maxAmount: 25000,
        tenureMonths: 12,
        monthlyReturnPercent: 2.5,
      },
    }),
    prisma.fDPlan.create({
      data: {
        name: 'Gold Premium',
        description: 'Ideal for steady growth with a moderate investment.',
        minAmount: 25000,
        maxAmount: 100000,
        tenureMonths: 18,
        monthlyReturnPercent: 3.0,
      },
    }),
    prisma.fDPlan.create({
      data: {
        name: 'Platinum Elite',
        description: 'High returns for serious investors.',
        minAmount: 100000,
        maxAmount: 1000000,
        tenureMonths: 24,
        monthlyReturnPercent: 3.5,
      },
    }),
  ])

  // --- Landing Content ---
  const landingContents = [
    { section: 'hero', key: 'title', value: 'Grow Your Wealth With Expert Trading Signals & Fixed Returns', type: CMSType.TEXT },
    { section: 'hero', key: 'subtitle', value: 'Experience institutional-grade financial growth. Join thousands of investors leveraging our proprietary algorithms.', type: CMSType.TEXT },
    { section: 'hero', key: 'badge', value: 'Premium Investment Platform', type: CMSType.TEXT },
    { section: 'hero', key: 'stat_1_value', value: '15K+', type: CMSType.TEXT },
    { section: 'hero', key: 'stat_1_label', value: 'Active Investors', type: CMSType.TEXT },
    { section: 'about', key: 'title', value: 'Welcome to Javitri Trading Service', type: CMSType.TEXT },
    { section: 'about', key: 'description_1', value: 'We are a SEBI-registered stock market research firm with over 10 years of experience.', type: CMSType.TEXT },
    { section: 'plans', key: 'title', value: 'Investment Plans', type: CMSType.TEXT },
    { section: 'plans', key: 'subtitle', value: 'Daily income opportunities with expert guidance.', type: CMSType.TEXT },
  ]

  for (const content of landingContents) {
    await prisma.landingContent.create({
      data: content
    })
  }

  // --- Testimonials ---
  await prisma.testimonial.createMany({
    data: [
      { name: 'Ramesh Singh', message: 'I have been investing with them for a year and the returns are fantastic!', rating: 5, order: 1 },
      { name: 'Priya Verma', message: 'Very transparent and prompt payouts.', rating: 5, order: 2 },
      { name: 'Suresh Patil', message: 'The platform is easy to use and support is great.', rating: 4, order: 3 },
    ]
  })

  // --- FAQs ---
  await prisma.fAQ.createMany({
    data: [
      { question: 'What is the minimum investment?', answer: 'The minimum investment starts at ₹5,000.', order: 1 },
      { question: 'How do I withdraw my returns?', answer: 'You can withdraw directly to your bank account using the dashboard.', order: 2 },
      { question: 'Is my capital safe?', answer: 'We use advanced risk management strategies to protect your capital.', order: 3 },
    ]
  })

  // --- Videos ---
  await prisma.video.createMany({
    data: [
      { title: 'Platform Overview', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order: 1 },
      { title: 'How to Invest', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order: 2 },
    ]
  })

  // --- Site Settings ---
  await prisma.siteSettings.createMany({
    data: [
      { key: 'contact_email', value: 'support@traderfdscheme.com' },
      { key: 'contact_phone', value: '+91-9000000000' },
      { key: 'telegram_url', value: 'https://t.me/Javitritradingservice' },
      { key: 'office_address', value: 'Mumbai, Maharashtra, India' },
    ]
  })

  console.log('Seed completed successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

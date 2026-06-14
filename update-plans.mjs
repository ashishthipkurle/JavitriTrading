import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.fDPlan.deleteMany({})

  const plans = [
    { name: '₹5k PLAN', monthlyReturnPercent: 200, minAmount: 5000, tenureMonths: 30, description: 'Referral Bonus Available', isActive: true },
    { name: '₹10k PLAN', monthlyReturnPercent: 500, minAmount: 10000, tenureMonths: 30, description: 'Beginner Friendly Plan', isActive: true },
    { name: '₹20k PLAN', monthlyReturnPercent: 1100, minAmount: 20000, tenureMonths: 30, description: 'Strong Growth Potential', isActive: true },
    { name: '₹30k PLAN', monthlyReturnPercent: 1700, minAmount: 30000, tenureMonths: 30, description: 'Advanced Income Plan', isActive: true },
    { name: '₹50k PLAN', monthlyReturnPercent: 2800, minAmount: 50000, tenureMonths: 30, description: 'Premium Investor Plan', isActive: true },
    { name: '₹80k PLAN', monthlyReturnPercent: 4500, minAmount: 80000, tenureMonths: 30, description: 'High Performance Portfolio', isActive: true },
    { name: '₹1L PLAN', monthlyReturnPercent: 6000, minAmount: 100000, tenureMonths: 30, description: 'Elite Wealth Growth Plan', isActive: true },
  ];

  for (const plan of plans) {
    await prisma.fDPlan.create({
      data: plan
    })
  }
  console.log('Database updated successfully with new plans.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

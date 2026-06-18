import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const plans = [
  {
    name: '₹5k PLAN',
    description: 'Expected Daily Return: ₹200+',
    tagline: 'Referral Bonus Available',
    amount: 5000,
    dailyReturnAmount: 200,
  },
  {
    name: '₹10k PLAN',
    description: 'Expected Daily Return: ₹500+',
    tagline: 'Beginner Friendly Plan',
    amount: 10000,
    dailyReturnAmount: 500,
  },
  {
    name: '₹20k PLAN',
    description: 'Expected Daily Return: ₹1,100+',
    tagline: 'Strong Growth Potential',
    amount: 20000,
    dailyReturnAmount: 1100,
  },
  {
    name: '₹30k PLAN',
    description: 'Expected Daily Return: ₹1,700+',
    tagline: 'Advanced Income Plan',
    amount: 30000,
    dailyReturnAmount: 1700,
  },
  {
    name: '₹50k PLAN',
    description: 'Expected Daily Return: ₹2,800+',
    tagline: 'Premium Investor Plan',
    amount: 50000,
    dailyReturnAmount: 2800,
  },
  {
    name: '₹80k PLAN',
    description: 'Expected Daily Return: ₹4,500+',
    tagline: 'High Performance Portfolio',
    amount: 80000,
    dailyReturnAmount: 4500,
  },
  {
    name: '₹1L PLAN',
    description: 'Expected Daily Return: ₹6,000+',
    tagline: 'Elite Wealth Growth Plan',
    amount: 100000,
    dailyReturnAmount: 6000,
  },
];

async function main() {
  console.log('Syncing FD Plans from promotional poster...');

  // Get all existing plans
  const existingPlans = await prisma.fDPlan.findMany();

  // For each poster plan, check if it exists by amount. If so update, else create.
  for (const plan of plans) {
    const existing = existingPlans.find((p) => p.amount.toNumber() === plan.amount);

    if (existing) {
      await prisma.fDPlan.update({
        where: { id: existing.id },
        data: {
          name: plan.name,
          description: plan.description,
          tagline: plan.tagline,
          dailyReturnAmount: plan.dailyReturnAmount,
          isActive: true, // ensure it's active
        },
      });
      console.log(`Updated existing plan: ${plan.name}`);
    } else {
      await prisma.fDPlan.create({
        data: {
          name: plan.name,
          description: plan.description,
          tagline: plan.tagline,
          amount: plan.amount,
          dailyReturnAmount: plan.dailyReturnAmount,
          isActive: true,
        },
      });
      console.log(`Created new plan: ${plan.name}`);
    }
  }

  // Deactivate any existing plans that aren't in the poster list
  const validAmounts = plans.map(p => p.amount);
  for (const existing of existingPlans) {
    if (!validAmounts.includes(existing.amount.toNumber())) {
      await prisma.fDPlan.update({
        where: { id: existing.id },
        data: { isActive: false },
      });
      console.log(`Deactivated legacy plan: ${existing.name} (Amount: ${existing.amount})`);
    }
  }

  console.log('✅ FD Plans sync complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

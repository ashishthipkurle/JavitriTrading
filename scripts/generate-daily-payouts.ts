import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log("Starting daily payout & commission generation...");

  // Find all ACTIVE investments
  const activeInvestments = await prisma.investment.findMany({
    where: { status: 'ACTIVE' },
    include: {
      plan: true,
      user: true,
    }
  });

  let payoutCount = 0;
  let commissionCount = 0;

  for (const investment of activeInvestments) {
    // Determine the daily return
    // (We stored daily return in monthlyReturn field temporarily to avoid schema changes)
    const dailyReturn = Number(investment.monthlyReturn); 

    if (dailyReturn <= 0) continue;

    await prisma.$transaction(async (tx) => {
      // 1. Create Payout for Client
      const payout = await tx.payout.create({
        data: {
          investmentId: investment.id,
          amount: dailyReturn,
          paidOn: new Date(),
          status: 'PROCESSED'
        }
      });

      // 2. Add payout to Client's wallet
      await tx.user.update({
        where: { id: investment.userId },
        data: { walletBalance: { increment: dailyReturn } }
      });

      // 3. Update totalEarned on Investment
      await tx.investment.update({
        where: { id: investment.id },
        data: { totalEarned: { increment: dailyReturn } }
      });

      payoutCount++;

      // 4. Calculate Employee Commission (20% of client profit)
      if (investment.managedBy) {
        const commissionAmount = dailyReturn * 0.20;

        await tx.commission.create({
          data: {
            employeeId: investment.managedBy,
            investmentId: investment.id,
            payoutId: payout.id,
            amount: commissionAmount,
            status: 'PAID' // Marking as paid directly to wallet for simplicity
          }
        });

        // Add commission to Employee's wallet
        await tx.user.update({
          where: { id: investment.managedBy },
          data: { walletBalance: { increment: commissionAmount } }
        });

        commissionCount++;
      }
      
      // 5. Create Transaction record for Client
      await tx.transaction.create({
        data: {
          userId: investment.userId,
          type: 'PAYOUT',
          amount: dailyReturn,
          status: 'SUCCESS',
          meta: { investmentId: investment.id, payoutId: payout.id }
        }
      });
      
      // 6. Create Transaction record for Employee if commission generated
      if (investment.managedBy) {
         await tx.transaction.create({
          data: {
            userId: investment.managedBy,
            type: 'PAYOUT',
            amount: dailyReturn * 0.20,
            status: 'SUCCESS',
            meta: { investmentId: investment.id, type: 'COMMISSION' }
          }
        });
      }
    });
  }

  console.log(`Finished! Generated ${payoutCount} client payouts and ${commissionCount} employee commissions.`);
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

"use server";

import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const user = await getAuthUser();
  if (!user || user.role !== Role.ADMIN) {
    throw new Error("Unauthorized: Admin access required");
  }
  return user;
}

export async function processDailyPayouts() {
  try {
    const admin = await requireAdmin();

    const activeInvestments = await prisma.investment.findMany({
      where: { status: "ACTIVE" },
      include: { plan: true }
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let processedCount = 0;

    for (const inv of activeInvestments) {
      // Check if payout already exists for today
      const existingPayout = await prisma.payout.findFirst({
        where: {
          investmentId: inv.id,
          paidOn: {
            gte: today
          }
        }
      });

      if (existingPayout) continue; // Already paid today

      const dailyAmount = Number(inv.monthlyReturn); // Actually daily return based on logic

      await prisma.$transaction(async (tx) => {
        // 1. Create Payout
        const payout = await tx.payout.create({
          data: {
            investmentId: inv.id,
            amount: dailyAmount,
            paidOn: new Date(),
            status: "PROCESSED"
          }
        });

        // 2. Update Investment totalEarned
        await tx.investment.update({
          where: { id: inv.id },
          data: { totalEarned: { increment: dailyAmount } }
        });

        // 3. Update User Wallet
        await tx.user.update({
          where: { id: inv.userId },
          data: { walletBalance: { increment: dailyAmount } }
        });

        // 4. Create Transaction Log for user
        await tx.transaction.create({
          data: {
            userId: inv.userId,
            type: "PAYOUT",
            amount: dailyAmount,
            status: "SUCCESS",
            meta: { payoutId: payout.id, investmentId: inv.id, type: "Daily Return" }
          }
        });

        // 5. Handle Employee Commission (20%)
        if (inv.managedBy) {
          const commissionAmount = dailyAmount * 0.20;

          await tx.commission.create({
            data: {
              employeeId: inv.managedBy,
              investmentId: inv.id,
              payoutId: payout.id,
              amount: commissionAmount,
              status: "PAID"
            }
          });

          // Add commission to employee wallet
          await tx.user.update({
            where: { id: inv.managedBy },
            data: { walletBalance: { increment: commissionAmount } }
          });

          // Log transaction for employee
          await tx.transaction.create({
            data: {
              userId: inv.managedBy,
              type: "PAYOUT",
              amount: commissionAmount,
              status: "SUCCESS",
              meta: { payoutId: payout.id, type: "Client Commission" }
            }
          });
        }

        // 6. Check Maturity
        if (new Date() >= new Date(inv.maturityDate)) {
          await tx.investment.update({
            where: { id: inv.id },
            data: { status: "MATURED" }
          });
          
          // Return principal amount to wallet upon maturity
          await tx.user.update({
            where: { id: inv.userId },
            data: { walletBalance: { increment: Number(inv.amount) } }
          });

          // Log principal return
          await tx.transaction.create({
            data: {
              userId: inv.userId,
              type: "PAYOUT", 
              amount: Number(inv.amount),
              status: "SUCCESS",
              meta: { reason: "Maturity Principal Return", investmentId: inv.id }
            }
          });
        }
      });

      processedCount++;
    }

    // Audit Log
    await prisma.auditLog.create({
      data: {
        actorId: admin.id,
        action: "PROCESS_DAILY_PAYOUTS",
        meta: { processedCount }
      }
    });

    revalidatePath('/admin');
    return { success: true, processedCount };
  } catch (error: any) {
    console.error("Payout process error:", error);
    return { success: false, message: error.message };
  }
}

export async function stopInvestment(investmentId: string) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "CLIENT") throw new Error("Unauthorized");

    return await prisma.$transaction(async (tx) => {
      const inv = await tx.investment.findUnique({
        where: { id: investmentId }
      });

      if (!inv || inv.userId !== user.id) throw new Error("Investment not found");
      if (inv.status !== "ACTIVE") throw new Error("Investment is not active");

      const refundAmount = Number(inv.amount);

      // Mark as withdrawn
      await tx.investment.update({
        where: { id: inv.id },
        data: { status: "WITHDRAWN" }
      });

      // Refund principal to wallet (earnings were already paid out daily)
      await tx.user.update({
        where: { id: user.id },
        data: { walletBalance: { increment: refundAmount } }
      });

      // Create transaction log
      await tx.transaction.create({
        data: {
          userId: user.id,
          type: "PAYOUT",
          amount: refundAmount,
          status: "SUCCESS",
          meta: { reason: "Premature FD Closure Refund", investmentId: inv.id }
        }
      });

      // Audit Log
      await tx.auditLog.create({
        data: {
          actorId: user.id,
          action: "STOP_FD",
          targetId: inv.id,
          meta: { refundAmount }
        }
      });

      revalidatePath("/dashboard/investments");
      revalidatePath("/dashboard/wallet");
      return { success: true };
    });
  } catch (error: any) {
    console.error("Stop Investment Error:", error);
    return { success: false, message: error.message };
  }
}

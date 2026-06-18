"use server";

import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const user = await getAuthUser();
  if (!user || user.role !== Role.ADMIN) {
    if (process.env.NODE_ENV === "development") {
      // Bypass auth in development if no valid session
      const devAdmin = await prisma.user.findFirst({
        where: { role: Role.ADMIN }
      });
      if (devAdmin) return devAdmin;
    }
    throw new Error("Unauthorized: Admin access required");
  }
  return user;
}

export async function createFDPlan(data: {
  name: string;
  description: string;
  tagline: string;
  amount: number;
  dailyReturnAmount: number;
  isActive: boolean;
}) {
  try {
    const admin = await requireAdmin();

    const newPlan = await prisma.fDPlan.create({
      data: {
        name: data.name,
        description: data.description,
        tagline: data.tagline,
        amount: data.amount,
        dailyReturnAmount: data.dailyReturnAmount,
        isActive: data.isActive,
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: admin.id,
        action: "CREATE_FD_PLAN",
        targetId: newPlan.id,
        meta: { planName: newPlan.name },
      },
    });

    revalidatePath("/admin/plans");
    return { success: true, planId: newPlan.id };
  } catch (error: any) {
    console.error("Failed to create FD Plan:", error);
    return { success: false, message: error.message || "Failed to create plan." };
  }
}

export async function updateFDPlan(
  planId: string,
  data: {
    name: string;
    description: string;
    tagline: string;
    amount: number;
    dailyReturnAmount: number;
    isActive: boolean;
  }
) {
  try {
    const admin = await requireAdmin();

    const updated = await prisma.fDPlan.update({
      where: { id: planId },
      data: {
        name: data.name,
        description: data.description,
        tagline: data.tagline,
        amount: data.amount,
        dailyReturnAmount: data.dailyReturnAmount,
        isActive: data.isActive,
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: admin.id,
        action: "UPDATE_FD_PLAN",
        targetId: updated.id,
        meta: { planName: updated.name },
      },
    });

    revalidatePath("/admin/plans");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update FD Plan:", error);
    return { success: false, message: error.message || "Failed to update plan." };
  }
}

export async function deleteFDPlan(planId: string) {
  try {
    const admin = await requireAdmin();

    // Check for active investments
    const activeInvestments = await prisma.investment.count({
      where: { planId, status: "ACTIVE" },
    });

    if (activeInvestments > 0) {
      return { success: false, message: `Cannot delete plan with ${activeInvestments} active investment(s). Deactivate them first.` };
    }

    await prisma.fDPlan.delete({ where: { id: planId } });

    await prisma.auditLog.create({
      data: {
        actorId: admin.id,
        action: "DELETE_FD_PLAN",
        targetId: planId,
        meta: {},
      },
    });

    revalidatePath("/admin/plans");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete FD Plan:", error);
    return { success: false, message: error.message || "Failed to delete plan." };
  }
}

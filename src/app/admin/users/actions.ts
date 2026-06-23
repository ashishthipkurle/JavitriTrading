"use server";

import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { deleteCloudinaryFile } from "@/lib/cloudinary";

async function verifyAdmin() {
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

export async function blockUser(userId: string) {
  await verifyAdmin();
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { isBlocked: true }
    });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function unblockUser(userId: string) {
  await verifyAdmin();
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { isBlocked: false }
    });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function deleteUser(userId: string) {
  await verifyAdmin();
  try {
    // Delete from Supabase Auth
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (authError) {
      console.error("Supabase auth delete error:", authError);
    }

    // Gather all cloud files to delete
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { kyc: true, transactions: true } });
    if (user) {
      const urlsToDelete: string[] = [];
      if (user.avatarUrl) urlsToDelete.push(user.avatarUrl);
      if (user.kyc?.panDocUrl) urlsToDelete.push(user.kyc.panDocUrl);
      if (user.kyc?.aadhaarDocUrl) urlsToDelete.push(user.kyc.aadhaarDocUrl);
      
      user.transactions.forEach((tx) => {
        if (tx.meta && typeof tx.meta === 'object' && 'proofUrl' in tx.meta) {
          const proofUrl = (tx.meta as any).proofUrl;
          if (proofUrl && typeof proofUrl === 'string') {
            urlsToDelete.push(proofUrl);
          }
        }
      });

      // Delete all collected URLs from Cloudinary
      await Promise.all(urlsToDelete.map(url => deleteCloudinaryFile(url)));
    }

    // Delete dependent records and the user
    await prisma.$transaction([
      prisma.kYC.deleteMany({ where: { userId } }),
      prisma.transaction.deleteMany({ where: { userId } }),
      prisma.investment.deleteMany({ where: { userId } }),
      prisma.withdrawalRequest.deleteMany({ where: { userId } }),
      prisma.notification.deleteMany({ where: { userId } }),
      prisma.auditLog.deleteMany({ where: { actorId: userId } }),
      prisma.supportTicket.deleteMany({ where: { userId } }),
      prisma.user.updateMany({ where: { managedBy: userId }, data: { managedBy: null } }), // If this user managed anyone
      prisma.user.delete({ where: { id: userId } })
    ]);

    revalidatePath("/admin/users");
    return { success: true };
  } catch (err: any) {
    console.error("Delete user error:", err);
    return { error: err.message || "Failed to delete user." };
  }
}

export async function approveKyc(userId: string) {
  await verifyAdmin();
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { kycStatus: "APPROVED" }
    });
    revalidatePath("/admin/users");
    revalidatePath("/admin/employees");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function rejectKyc(userId: string, reason?: string) {
  await verifyAdmin();
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { kycStatus: "REJECTED" }
    });
    // Store rejection note if provided
    if (reason) {
      await prisma.kYC.updateMany({
        where: { userId },
        data: { rejectionNote: reason }
      });
    }
    revalidatePath("/admin/users");
    revalidatePath("/admin/employees");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

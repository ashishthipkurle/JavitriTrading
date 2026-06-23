"use server";

import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

// Helper to ensure the caller is an ADMIN
async function requireAdmin() {
  const user = await getAuthUser();
  if (!user || user.role !== Role.ADMIN) {
    throw new Error("Unauthorized: Admin access required");
  }
  return user;
}

export async function makeEmployee(email: string) {
  const admin = await requireAdmin();

  if (!email || !email.trim()) {
    return { success: false, message: "Email is required." };
  }

  const targetUser = await prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
  });

  if (!targetUser) {
    return { success: false, message: "No user found with that email address." };
  }

  if (targetUser.role === Role.ADMIN) {
    return { success: false, message: "Cannot change the role of an admin user." };
  }

  if (targetUser.role === Role.EMPLOYEE) {
    return { success: false, message: "This user is already an employee." };
  }

  await prisma.user.update({
    where: { id: targetUser.id },
    data: { role: Role.EMPLOYEE },
  });

  // Log the action
  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: "PROMOTE_TO_EMPLOYEE",
      targetId: targetUser.id,
      meta: { targetEmail: targetUser.email, targetName: targetUser.name },
    },
  });

  revalidatePath("/admin/employees");

  return {
    success: true,
    message: `${targetUser.name || targetUser.email} has been promoted to Employee.`,
  };
}

export async function demoteEmployee(userId: string) {
  const admin = await requireAdmin();

  if (!userId) {
    return { success: false, message: "User ID is required." };
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!targetUser) {
    return { success: false, message: "User not found." };
  }

  if (targetUser.role !== Role.EMPLOYEE) {
    return { success: false, message: "This user is not an employee." };
  }

  await prisma.user.update({
    where: { id: targetUser.id },
    data: { role: Role.CLIENT },
  });

  // Log the action
  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: "DEMOTE_TO_CLIENT",
      targetId: targetUser.id,
      meta: { targetEmail: targetUser.email, targetName: targetUser.name },
    },
  });

  revalidatePath("/admin/employees");

  return {
    success: true,
    message: `${targetUser.name || targetUser.email} has been demoted to Client.`,
  };
}

export async function getEmployees() {
  await requireAdmin();

  const employees = await prisma.user.findMany({
    where: { role: Role.EMPLOYEE },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
      kycStatus: true,
      kyc: {
        select: {
          panDocUrl: true,
          aadhaarDocUrl: true,
        }
      },
      _count: {
        select: { clients: true },
      },
    },
  });

  return employees;
}

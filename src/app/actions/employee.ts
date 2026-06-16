"use server";

import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";
import bcrypt from "bcryptjs";

import { encrypt } from "@/lib/encryption";
import { verifyBankAccount } from "@/lib/bank-validation";

export async function createClientAccountByEmployee(data: any) {
  try {
    const employee = await getAuthUser();
    if (!employee || employee.role !== "EMPLOYEE") {
      throw new Error("Unauthorized: Employee access required");
    }

    const { name, email, phone, password, bankAccount, ifsc, panDocUrl, aadhaarDocUrl } = data;
    if (!name || !email || !phone || !password || !bankAccount || !ifsc || !panDocUrl || !aadhaarDocUrl) {
      throw new Error("Missing required fields including KYC details");
    }

    // Check if user already exists in DB
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { phone }
        ]
      }
    });

    if (existingUser) {
      throw new Error("User with this email or phone already exists");
    }

    // VERIFY BANK ACCOUNT INSTANTLY
    await verifyBankAccount(bankAccount, ifsc, name);

    // Create user in Supabase Auth via Admin API
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, phone }
    });

    if (authError) {
      throw new Error(authError.message);
    }

    // Use transaction to create Profile and KYC
    const newUser = await prisma.$transaction(async (tx) => {
      // Create Prisma Profile assigned to this employee
      const user = await tx.user.create({
        data: {
          id: authData.user.id, // match Supabase ID
          name,
          email,
          phone,
          role: "CLIENT",
          accountOrigin: "EMPLOYEE_MANAGED",
          managedBy: employee.id,
          kycStatus: "APPROVED" // Automatically approved when created by employee
        }
      });

      // Encrypt sensitive KYC fields
      const encBankAccount = encrypt(bankAccount);

      // Create KYC record
      await tx.kYC.create({
        data: {
          userId: user.id,
          bankAccount: encBankAccount,
          ifsc: ifsc,
          panDocUrl: panDocUrl,
          aadhaarDocUrl: aadhaarDocUrl
        }
      });

      return user;
    });

    // Log the action
    await prisma.auditLog.create({
      data: {
        actorId: employee.id,
        action: "CREATE_CLIENT_ACCOUNT",
        targetId: newUser.id,
        meta: { email }
      }
    });

    revalidatePath("/employee/clients");
    revalidatePath("/employee/clients/new");
    
    return { success: true };
  } catch (error: any) {
    console.error("Employee Create Client Error:", error);
    return { success: false, message: error.message || "Failed to create client account." };
  }
}

export async function createClientFDByEmployee(data: {
  clientId: string;
  planId: string;
  tenureDays: number;
}) {
  try {
    const employee = await getAuthUser();
    if (!employee || employee.role !== "EMPLOYEE") {
      throw new Error("Unauthorized: Employee access required");
    }

    if (!data.clientId || !data.planId || !data.tenureDays || data.tenureDays <= 0) {
      throw new Error("Invalid investment details. Plan and tenure are required.");
    }

    // Verify client is managed by this employee
    const client = await prisma.user.findUnique({
      where: { id: data.clientId }
    });

    if (!client || client.role !== "CLIENT" || client.managedBy !== employee.id) {
      throw new Error("Unauthorized: You do not manage this client");
    }

    if (client.kycStatus !== 'APPROVED') {
      throw new Error("Client KYC must be approved to invest");
    }

    // Use a transaction to ensure wallet balance deduction and investment creation are atomic
    const result = await prisma.$transaction(async (tx) => {
      const plan = await tx.fDPlan.findUnique({ where: { id: data.planId } });
      if (!plan || !plan.isActive) {
        throw new Error("Plan not found or inactive");
      }

      const amount = Number(plan.amount);

      if (Number(client.walletBalance) < amount) {
        throw new Error("Client has insufficient wallet balance");
      }

      // Deduct balance from client
      await tx.user.update({
        where: { id: client.id },
        data: { walletBalance: { decrement: amount } }
      });

      // Calculate dates and returns
      const startDate = new Date();
      const maturityDate = new Date(startDate);
      maturityDate.setDate(maturityDate.getDate() + data.tenureDays);
      const dailyReturn = Number(plan.dailyReturnAmount);

      // Create investment
      const investment = await tx.investment.create({
        data: {
          userId: client.id,
          planId: plan.id,
          managedBy: employee.id, // Ensure this maps to employee
          amount,
          startDate,
          maturityDate,
          monthlyReturn: dailyReturn, // storing daily return in this field as requested
          status: "ACTIVE",
        }
      });

      // Create transaction record
      await tx.transaction.create({
        data: {
          userId: client.id,
          type: "INVESTMENT",
          amount,
          status: "SUCCESS",
          meta: { investmentId: investment.id, planName: plan.name, tenureDays: data.tenureDays, createdBy: employee.id }
        }
      });

      // Audit log
      await tx.auditLog.create({
        data: {
          actorId: employee.id,
          action: "CREATE_CLIENT_INVESTMENT",
          targetId: investment.id,
          meta: { clientId: client.id, planName: plan.name }
        }
      });

      return investment;
    });

    revalidatePath("/employee/clients");
    revalidatePath(`/employee/clients/${data.clientId}/invest`);
    
    return { success: true, investmentId: result.id };
  } catch (error: any) {
    console.error("Employee Invest Error:", error);
    return { success: false, message: error.message || "Failed to create investment." };
  }
}

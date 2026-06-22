import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import AdminDocumentsClient from "./AdminDocumentsClient";
import { decrypt } from "@/lib/encryption";

export const dynamic = 'force-dynamic';

export default async function AdminDocumentsPage({ params }: { params: { id: string } }) {
  const authUser = await getAuthUser();
  if (!authUser || authUser.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const client = await prisma.user.findUnique({
    where: { id: params.id, role: "CLIENT" },
    include: {
      kyc: true,
    }
  });

  if (!client) {
    notFound();
  }

  // Get active plans to pass to the printable form
  const fdPlans = await prisma.fDPlan.findMany({
    where: { isActive: true },
    select: { id: true, name: true, amount: true }
  });

  // Decrypt sensitive info
  if (client.kyc) {
    if (client.kyc.panNumber) client.kyc.panNumber = decrypt(client.kyc.panNumber);
    if (client.kyc.aadhaarNumber) client.kyc.aadhaarNumber = decrypt(client.kyc.aadhaarNumber);
    if (client.kyc.bankAccount) client.kyc.bankAccount = decrypt(client.kyc.bankAccount);
  }

  return (
    <AdminDocumentsClient 
      user={client}
      fdPlans={fdPlans.map(p => ({ ...p, amount: Number(p.amount) }))}
      panDocUrl={client.kyc?.panDocUrl}
      aadhaarDocUrl={client.kyc?.aadhaarDocUrl}
    />
  );
}

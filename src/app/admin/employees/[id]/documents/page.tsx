import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import EmployeeDocumentsClient from "./EmployeeDocumentsClient";

export const dynamic = 'force-dynamic';

export default async function AdminEmployeeDocumentsPage({ params }: { params: { id: string } }) {
  const authUser = await getAuthUser();
  if (!authUser || authUser.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const employee = await prisma.user.findUnique({
    where: { id: params.id, role: "EMPLOYEE" },
    include: {
      kyc: true,
    }
  });

  if (!employee) {
    notFound();
  }

  return (
    <EmployeeDocumentsClient 
      user={employee}
      panDocUrl={employee.kyc?.panDocUrl}
      aadhaarDocUrl={employee.kyc?.aadhaarDocUrl}
    />
  );
}

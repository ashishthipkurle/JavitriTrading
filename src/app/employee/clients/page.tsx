import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import ClientListClient from "./ClientListClient";

export const dynamic = 'force-dynamic';

export default async function EmployeeClientsPage() {
  const user = await getAuthUser();
  if (!user || user.role !== "EMPLOYEE") return null;

  const clients = await prisma.user.findMany({
    where: { role: "CLIENT", managedBy: user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      investments: {
        where: { status: "ACTIVE" }
      }
    }
  });

  return <ClientListClient clients={clients} />;
}

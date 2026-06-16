import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditPlanForm from "./EditPlanForm";

export const dynamic = "force-dynamic";

export default async function EditPlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const plan = await prisma.fDPlan.findUnique({
    where: { id },
  });

  if (!plan) {
    notFound();
  }

  return (
    <EditPlanForm
      plan={{
        id: plan.id,
        name: plan.name,
        description: plan.description,
        tagline: plan.tagline,
        amount: Number(plan.amount),
        dailyReturnAmount: Number(plan.dailyReturnAmount),
        isActive: plan.isActive,
      }}
    />
  );
}

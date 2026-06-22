import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import PrintableInvestmentForm from "@/components/PrintableInvestmentForm";
import ClientSidePrint from "./ClientSidePrint";
import Link from "next/link";
import { decrypt } from "@/lib/encryption";

export const dynamic = 'force-dynamic';

export default async function EmployeeClientInvestmentForm({ params }: { params: { id: string } }) {
  const user = await getAuthUser();
  if (!user || user.role !== "EMPLOYEE") redirect("/login");

  const client = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      kyc: true,
      investments: {
        include: {
          plan: true
        },
        orderBy: { createdAt: 'asc' },
        take: 1
      }
    }
  });

  if (!client || client.role !== "CLIENT" || client.managedBy !== user.id) {
    notFound();
  }

  if (!client.kyc) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <h2 className="text-headline-md font-bold text-primary">No KYC Data Found</h2>
        <p className="text-on-surface-variant">The client has not submitted their KYC form yet.</p>
        <Link href="/employee/clients" className="bg-primary text-on-primary px-4 py-2 rounded font-bold hover:brightness-90">
          Back to Clients
        </Link>
      </div>
    );
  }

  // Get active plans to pass to the printable form
  const fdPlans = await prisma.fDPlan.findMany({
    where: { isActive: true },
    select: { id: true, name: true, amount: true }
  });

  const firstInvestment = client.investments[0];

  // Reconstruct formData from KYC
  const formData = {
    name: client.name,
    email: client.email,
    phone: client.phone,
    dateOfBirth: client.kyc.dateOfBirth || "",
    residentialAddress: client.kyc.residentialAddress || "",
    city: client.kyc.city || "",
    state: client.kyc.state || "",
    pinCode: client.kyc.pinCode || "",
    occupation: client.kyc.occupation || "",
    altPhone: client.kyc.altPhone || "",
    gender: client.kyc.gender || "",
    panNumber: client.kyc.panNumber ? decrypt(client.kyc.panNumber) : "",
    aadhaarNumber: client.kyc.aadhaarNumber ? decrypt(client.kyc.aadhaarNumber) : "",
    bankHolderName: client.kyc.bankHolderName || "",
    bankName: client.kyc.bankName || "",
    accountType: client.kyc.accountType || "",
    bankAccount: client.kyc.bankAccount ? decrypt(client.kyc.bankAccount) : "",
    ifsc: client.kyc.ifsc || "",
    upiId: client.kyc.upiId || "",
    nomineeName: client.kyc.nomineeName || "",
    nomineeRelation: client.kyc.nomineeRelation || "",
    nomineeDob: client.kyc.nomineeDob || "",
    nomineePhone: client.kyc.nomineePhone || "",
    referredBy: client.kyc.referredBy || "",
    referralCode: client.kyc.referralCode || "",
    formNumber: client.kyc.formNumber || "",
    branch: client.kyc.branch || "",
    investmentPlanId: firstInvestment?.planId || "",
    investmentAmount: firstInvestment?.amount?.toString() || "",
    modeOfPayment: "", // Not stored explicitly if they paid online later
    utrReference: "",
    paymentDate: firstInvestment?.createdAt ? new Date(firstInvestment.createdAt).toISOString().split('T')[0] : ""
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto py-8">
      <div className="no-print flex justify-between items-center bg-surface-container p-6 rounded-xl border border-outline-variant">
        <div>
          <h2 className="text-headline-md font-bold text-primary">Investment Form</h2>
          <p className="text-body-md text-on-surface-variant">Printable enrollment form for {client.name}</p>
        </div>
        <div className="flex gap-4">
          <Link href="/employee/clients" className="border border-outline-variant px-4 py-2 rounded font-bold hover:bg-surface-container-low transition">
            Back
          </Link>
          <ClientSidePrint />
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl border border-outline-variant overflow-x-auto shadow-sm no-print">
        <p className="text-center text-on-surface-variant mb-8 text-label-md">Preview</p>
        <div style={{ transform: 'scale(0.9)', transformOrigin: 'top center' }}>
          {/* We make the print form visible on screen for preview by overriding the hidden class */}
          <div className="[&>#printable-form]:!block [&>#printable-form]:!relative [&>#printable-form]:!w-full [&>#printable-form]:!translate-x-0 [&>#printable-form]:!left-0">
            <PrintableInvestmentForm formData={formData} plans={fdPlans.map(p => ({ ...p, amount: Number(p.amount) }))} />
          </div>
        </div>
      </div>
      
      {/* Actual print element */}
      <PrintableInvestmentForm formData={formData} plans={fdPlans.map(p => ({ ...p, amount: Number(p.amount) }))} />
    </div>
  );
}

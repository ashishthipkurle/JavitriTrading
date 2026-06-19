import { getEmployees } from "@/app/actions/admin";
import { UpgradeUserForm, DemoteButton } from "./EmployeeActions";


export const dynamic = 'force-dynamic';

export default async function AdminEmployeesPage() {
  const employees = await getEmployees();

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-unit-lg">
        <div>
          <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-primary mb-1">
            Employee Management
          </h1>
          <p className="text-body-md font-body-md text-on-surface-variant">
            Promote users to employees and manage your team.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-secondary-container/20 border border-secondary-container/30 rounded-lg">
          <span className="material-symbols-outlined text-secondary text-[20px]">badge</span>
          <span className="text-label-md font-label-md text-on-surface">
            <strong>{employees.length}</strong> Active Employee{employees.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Upgrade Form */}
      <UpgradeUserForm />

      {/* Employees Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-[0px_4px_12px_rgba(10,22,40,0.04)] mt-unit-lg">
        <div className="p-4 border-b border-outline-variant bg-surface-container flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">groups</span>
          <h3 className="text-label-lg font-label-lg text-on-surface font-bold">Active Employees</h3>
        </div>

        {employees.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-4xl text-outline">group_off</span>
            </div>
            <h2 className="text-headline-sm font-headline-sm text-on-surface mb-2">No Employees Yet</h2>
            <p className="text-body-md font-body-md text-on-surface-variant max-w-md">
              Use the form above to promote a registered user to an employee. They will then be able to access the employee dashboard.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-surface-container-lowest border-b border-outline-variant">
                  <th className="p-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Employee</th>
                  <th className="p-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Phone</th>
                  <th className="p-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">KYC Status</th>
                  <th className="p-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider text-center">Managed Clients</th>
                  <th className="p-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Joined</th>
                  <th className="p-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {employees.map((emp) => {
                  const initials = (emp.name || emp.email)
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2);

                  const kycColor =
                    emp.kycStatus === "APPROVED"
                      ? "bg-[#009668]/10 text-[#005236]"
                      : emp.kycStatus === "REJECTED"
                      ? "bg-[#ba1a1a]/10 text-[#93000a]"
                      : "bg-secondary-container/20 text-on-secondary-container";

                  const kycIcon =
                    emp.kycStatus === "APPROVED"
                      ? "check_circle"
                      : emp.kycStatus === "REJECTED"
                      ? "error"
                      : "pending";

                  return (
                    <tr key={emp.id} className="hover:bg-surface-container-low transition-colors h-[72px]">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary-fixed text-primary flex items-center justify-center text-label-md font-label-md font-bold border border-outline-variant">
                            {initials}
                          </div>
                          <div>
                            <p className="text-label-md font-label-md text-primary">{emp.name || "Unnamed"}</p>
                            <p className="text-body-sm font-body-sm text-on-surface-variant">{emp.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-body-sm font-body-sm text-on-surface-variant">{emp.phone}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-label-sm font-label-sm gap-1 ${kycColor}`}>
                          <span className="material-symbols-outlined text-[14px]">{kycIcon}</span>
                          {emp.kycStatus}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="text-data-mono font-data-mono text-primary">{emp._count.clients}</span>
                      </td>
                      <td className="p-4 text-body-sm font-body-sm text-on-surface-variant">
                        {new Date(emp.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="p-4 text-right">
                        <DemoteButton userId={emp.id} userName={emp.name || emp.email} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

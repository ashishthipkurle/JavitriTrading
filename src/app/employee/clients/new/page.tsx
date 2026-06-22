import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import CreateClientForm from "./CreateClientForm";


export const dynamic = 'force-dynamic';

export default async function AssignClientPage({ searchParams }: { searchParams: { q?: string; tab?: string } }) {
  const user = await getAuthUser();
  if (!user || user.role !== "EMPLOYEE") return null;

  const query = searchParams.q || "";

  let searchResults: any[] = [];
  if (query.length >= 3) {
    searchResults = await prisma.user.findMany({
      where: {
        role: "CLIENT",
        OR: [
          { email: { contains: query, mode: 'insensitive' } },
          { phone: { contains: query } },
          { name: { contains: query, mode: 'insensitive' } }
        ]
      },
      take: 10
    });
  }

  // Server action to assign a client to this employee
  async function assignClient(formData: FormData) {
    "use server";
    const employee = await getAuthUser();
    if (!employee || employee.role !== "EMPLOYEE") return;

    const clientId = formData.get("clientId") as string;
    
    // Check if client is already managed by someone else
    const client = await prisma.user.findUnique({ where: { id: clientId } });
    if (!client) return;
    
    if (client.managedBy && client.managedBy !== employee.id) {
      console.error("Cannot reassign a client managed by another employee.");
      return;
    }

    await prisma.user.update({
      where: { id: clientId },
      data: { managedBy: employee.id }
    });

    revalidatePath("/employee/clients");
    redirect("/employee/clients");
  }

  // Fetch active FD plans to pass to the form
  const fdPlans = await prisma.fDPlan.findMany({
    where: { isActive: true },
    orderBy: { amount: 'asc' },
    select: { id: true, name: true, amount: true }
  });

  const activeTab = searchParams.tab === 'search' || query ? 'search' : 'create';

  return (
    <div className="flex flex-col gap-unit-xl">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Link href="/employee/clients" className="text-on-surface-variant hover:text-primary transition-colors flex items-center">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            <span className="text-label-md font-label-md ml-1">Back to Clients</span>
          </Link>
        </div>
        <h2 className="text-headline-md font-headline-md text-primary font-bold">Assign or Create Client</h2>
        <p className="text-body-md font-body-md text-on-surface-variant mt-1">
          Search for an existing client or create a brand new account on their behalf.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-outline-variant">
        <Link 
          href="?tab=create"
          className={`pb-3 text-label-lg font-bold transition-colors border-b-2 ${
            activeTab === 'create' 
              ? 'text-primary border-primary' 
              : 'text-on-surface-variant border-transparent hover:text-primary'
          }`}
        >
          Create New Client
        </Link>
        <Link 
          href="?tab=search"
          className={`pb-3 text-label-lg font-bold transition-colors border-b-2 ${
            activeTab === 'search' 
              ? 'text-primary border-primary' 
              : 'text-on-surface-variant border-transparent hover:text-primary'
          }`}
        >
          Search Existing Users
        </Link>
      </div>

      <div className="w-full">
        {/* Create New Client Tab */}
        {activeTab === 'create' && (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg w-full max-w-4xl mx-auto">
            <h3 className="text-headline-sm font-headline-sm text-primary font-bold mb-2">Create New Client</h3>
            <p className="text-body-sm text-on-surface-variant border-b border-outline-variant pb-4 mb-4">
              Register a new client directly. They will be automatically assigned to your portfolio.
            </p>
            <CreateClientForm plans={fdPlans.map(p => ({ ...p, amount: Number(p.amount) }))} />
          </div>
        )}

        {/* Search Existing Client Tab */}
        {activeTab === 'search' && (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg w-full max-w-4xl mx-auto">
            <h3 className="text-headline-sm font-headline-sm text-primary font-bold mb-2">Search Existing Users</h3>
            <p className="text-body-sm text-on-surface-variant border-b border-outline-variant pb-4 mb-4">
              If the client already created an account on the website, find them here to assign them to your portfolio.
            </p>
            
            <form className="flex gap-4 mb-6" method="GET">
              <input type="hidden" name="tab" value="search" />
              <input 
                type="text" 
                name="q"
                defaultValue={query}
                placeholder="Search by email, phone, or name..." 
                className="flex-1 bg-surface border border-outline-variant rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary outline-none"
              />
              <button type="submit" className="bg-primary text-on-primary px-6 py-2 rounded-lg font-bold hover:brightness-90 transition-all">
                Search
              </button>
            </form>

            {query.length > 0 && query.length < 3 && (
              <p className="text-on-surface-variant text-label-md">Please enter at least 3 characters to search.</p>
            )}

            {searchResults.length > 0 && (
              <div className="flex flex-col gap-4">
                <h4 className="text-label-md font-label-md text-on-surface mb-2">Search Results:</h4>
                {searchResults.map(client => (
                  <div key={client.id} className="flex items-center justify-between p-4 border border-outline-variant rounded-lg bg-surface hover:border-primary/50 transition-colors">
                    <div>
                      <h4 className="font-bold text-primary">{client.name || 'No Name'}</h4>
                      <p className="text-label-sm text-on-surface-variant">{client.email} • {client.phone}</p>
                      {client.managedBy === user.id ? (
                        <span className="inline-block mt-2 px-2 py-1 bg-secondary-container/30 text-secondary-container rounded text-[10px] font-bold uppercase tracking-wider">Already in your portfolio</span>
                      ) : client.managedBy ? (
                        <span className="inline-block mt-2 px-2 py-1 bg-error-container/30 text-error rounded text-[10px] font-bold uppercase tracking-wider">Managed by another employee</span>
                      ) : (
                        <span className="inline-block mt-2 px-2 py-1 bg-outline-variant/30 text-on-surface-variant rounded text-[10px] font-bold uppercase tracking-wider">Unassigned</span>
                      )}
                    </div>
                    
                    {client.managedBy !== user.id && !client.managedBy && (
                      <form action={assignClient}>
                        <input type="hidden" name="clientId" value={client.id} />
                        <button type="submit" className="bg-secondary text-on-secondary px-4 py-2 rounded-lg text-label-sm font-bold hover:brightness-90 transition-all">
                          Assign to Me
                        </button>
                      </form>
                    )}
                    {client.managedBy && client.managedBy !== user.id && (
                       <button type="button" disabled className="bg-surface-container text-on-surface-variant px-4 py-2 rounded-lg text-label-sm font-bold opacity-50 cursor-not-allowed">
                         Locked
                       </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {query.length >= 3 && searchResults.length === 0 && (
              <p className="text-on-surface-variant text-label-md bg-surface-container p-4 rounded-lg text-center">No clients found matching &quot;{query}&quot;. The client must register an account first.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

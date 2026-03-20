import AdminHeader from "../components/AdminHeader";
import { getResources } from "@/app/actions/resources";
import ResourceTableClient from "./ResourceTableClient";
import { getAuthenticatedUser } from "@/lib/auth";

export const metadata = {
  title: "Resources | Admin",
  description: "Knowledge vault resource management",
};

export default async function AdminResourcesPage() {
  const user = await getAuthenticatedUser();
  const { resources, success, error } = await getResources();

  if (!success) {
    return (
      <div className="flex-1 overflow-x-hidden min-h-screen bg-ink flex flex-col items-center justify-center">
         <p className="text-red-500">Error loading resources. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-x-hidden min-h-screen bg-ink flex flex-col relative">
      <main className="p-8 md:p-14 max-w-[1400px] w-full mx-auto text-surface space-y-8 pb-32 relative z-10 flex-1 flex flex-col">
        <AdminHeader fullName={user?.profile?.fullName || null} email={user?.email || ""} />
        <div className="flex flex-col gap-1">
          <h1 className="text-xl md:text-[22px] font-semibold tracking-[-0.02em] text-surface">Knowledge Vault</h1>
          <p className="text-gray-300 text-[13px] leading-relaxed max-w-2xl">
            Manage supplemental videos, tools, and articles for students. These resources will appear in the Knowledge Vault section of the student portal.
          </p>
        </div>

        <ResourceTableClient initialResources={resources || []} />
      </main>
    </div>
  );
}

import { getResources } from "@/app/actions/resources";
import ResourcesClient from "./ResourcesClient";

export const metadata = {
  title: "Vault | OpenSch",
  description: "Knowledge Vault and Resources",
};

export default async function ResourcesPage() {
  const { resources, success } = await getResources();

  if (!success) {
    return (
      <div className="flex-1 overflow-x-hidden min-h-screen p-6 flex flex-col items-center justify-center">
         <p className="text-red-500 font-mono text-sm">Failed to load the knowledge vault.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-x-hidden min-h-screen flex flex-col">
      <main className="p-4 md:p-8 lg:p-12 w-full max-w-[1600px] mx-auto space-y-12">
        <header className="space-y-3">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#FFFFFF]">Knowledge Vault</h1>
          <p className="text-[#888888] text-sm md:text-base max-w-2xl leading-relaxed">
            Curated articles, interviews, and deep dives to augment your journey. 
            Select an item below to dive in.
          </p>
        </header>

        <ResourcesClient initialResources={resources || []} />
      </main>
    </div>
  );
}

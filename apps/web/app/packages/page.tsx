import AddPackageModal from "./AddPackageModal";
import PackagesList from "@/components/PackagesList";

async function getPackages() {
  try {
    const res = await fetch("http://localhost:5000/api/packages", { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch packages:", error);
    return [];
  }
}

export default async function PackagesPage() {
  const packages = await getPackages();

  return (
    <div className="min-h-screen bg-background py-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="mb-12 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-4xl font-bold mb-4">Tour Packages</h1>
          <p className="text-muted-foreground text-lg">Find the perfect getaway for your next adventure.</p>
        </div>
        <AddPackageModal />
      </div>

      <PackagesList initialPackages={packages} />
    </div>
  );
}

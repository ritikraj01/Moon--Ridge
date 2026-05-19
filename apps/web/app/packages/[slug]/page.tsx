import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EditPackageModal from "../EditPackageModal";
import DeletePackageButton from "../DeletePackageButton";
import ImageSlideshow from "./ImageSlideshow";
import BookingSidebar from "@/components/BookingSidebar";
import PackageReviews from "@/components/PackageReviews";

async function getPackage(slug: string) {
  try {
    const res = await fetch(`http://localhost:5000/api/packages/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Failed to fetch package:", error);
    return null;
  }
}

export default async function PackageDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pkg = await getPackage(slug);

  if (!pkg) return notFound();

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero */}
      <div className="relative h-[60vh] w-full">
        <ImageSlideshow gallery={pkg.gallery || []} title={pkg.title} />
        <div className="absolute bottom-0 w-full p-8 bg-gradient-to-t from-background to-transparent z-30">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h1 className="text-5xl font-bold text-white mb-4">{pkg.title}</h1>
              <p className="text-xl text-gray-200">
                {pkg.duration} Days • Starts from ₹{pkg.pricing?.toLocaleString()}
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <EditPackageModal pkg={pkg} />
              <DeletePackageButton pkgId={pkg._id} title={pkg.title} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Overview */}
          <section>
            <h2 className="text-3xl font-bold mb-4">Overview</h2>
            <p className="text-muted-foreground leading-relaxed">{pkg.description}</p>
          </section>

          {/* Highlights */}
          {pkg.highlights?.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold mb-4">Highlights</h2>
              <ul className="grid grid-cols-2 gap-4">
                {pkg.highlights.map((h: string) => (
                  <li key={h} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Inclusions & Exclusions */}
          {(pkg.inclusions?.length > 0 || pkg.exclusions?.length > 0) && (
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {pkg.inclusions?.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-green-500">Inclusions</h2>
                  <ul className="space-y-2">
                    {pkg.inclusions.map((item: string) => (
                      <li key={item} className="flex items-center gap-2 text-muted-foreground">
                        <span className="text-green-500">✓</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {pkg.exclusions?.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-red-500">Exclusions</h2>
                  <ul className="space-y-2">
                    {pkg.exclusions.map((item: string) => (
                      <li key={item} className="flex items-center gap-2 text-muted-foreground">
                        <span className="text-red-500">✗</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          {/* Plan Comparison Table */}
          {pkg.plans?.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold mb-6">Compare Plans</h2>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="p-4 border-b">Feature</th>
                      {pkg.plans.map((plan: any) => (
                        <th
                          key={plan.name}
                          className={`p-4 border-b ${plan.name === "Premium" ? "text-amber-500" : ""}`}
                        >
                          {plan.name}
                          <div className="text-sm font-normal">₹{plan.price?.toLocaleString()}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Get max features length to build rows */}
                    {Array.from({ length: Math.max(...pkg.plans.map((p: any) => p.features?.length || 0)) }).map(
                      (_, i) => (
                        <tr key={i}>
                          <td className="p-4 border-b font-medium">Feature {i + 1}</td>
                          {pkg.plans.map((plan: any) => (
                            <td
                              key={plan.name}
                              className={`p-4 border-b ${plan.name === "Premium" ? "font-semibold text-amber-500" : ""}`}
                            >
                              {plan.features?.[i] || "—"}
                            </td>
                          ))}
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Itinerary */}
          {pkg.itinerary?.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold mb-4">Itinerary</h2>
              <Tabs defaultValue={`day${pkg.itinerary[0].day}`}>
                <TabsList className="mb-4 flex flex-wrap h-auto bg-transparent gap-2">
                  {pkg.itinerary.map((day: any) => (
                    <TabsTrigger
                      key={day.day}
                      value={`day${day.day}`}
                      className="data-[state=active]:bg-amber-500 data-[state=active]:text-black border border-border bg-card"
                    >
                      Day {day.day}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {pkg.itinerary.map((day: any) => (
                  <TabsContent key={day.day} value={`day${day.day}`} className="p-4 rounded-xl border bg-card/50">
                    <h3 className="text-xl font-bold mb-2">{day.title}</h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      {day.activities?.map((act: string) => (
                        <li key={act}>{act}</li>
                      ))}
                    </ul>
                  </TabsContent>
                ))}
              </Tabs>
            </section>
          )}

          {/* FAQs */}
          {pkg.FAQs?.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold mb-4">FAQs</h2>
              <div className="space-y-4">
                {pkg.FAQs.map((faq: any, i: number) => (
                  <div key={i} className="p-4 rounded-xl border bg-card/50">
                    <h3 className="font-semibold mb-1">{faq.question}</h3>
                    <p className="text-muted-foreground text-sm">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Reviews Section */}
          <div className="border-t border-border pt-12">
            <PackageReviews
              packageId={pkg._id}
              initialReviews={pkg.reviews || []}
              averageRating={pkg.averageRating || 0}
              numOfReviews={pkg.numOfReviews || 0}
            />
          </div>
        </div>

        {/* Sticky Booking Sidebar */}
        <div className="relative">
          <div className="sticky top-24">
            <BookingSidebar pkg={pkg} whatsappNumber={whatsappNumber} />
          </div>
        </div>
      </div>
    </div>
  );
}

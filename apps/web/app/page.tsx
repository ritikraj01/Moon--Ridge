import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] w-full flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop"
            alt="Travel Hero"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            Discover the World's Best <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500">
              Hidden Gems
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-gray-200 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
            Experience luxury travel like never before. Handpicked destinations, premium stays, and unforgettable memories.
          </p>
          <div className="flex gap-4 justify-center animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
            <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-black rounded-full px-8 py-6 text-lg font-semibold transition-all hover:scale-105">
              <Link href="/packages">Explore Packages</Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 py-6 text-lg font-semibold bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all hover:scale-105">
              <Link href="/build-trip">Customize Trip</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-24 bg-background px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Trending Destinations</h2>
          <p className="text-muted-foreground text-lg">Explore our most popular travel spots</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: "Ladakh", img: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=2070&auto=format&fit=crop" },
            { title: "Kashmir", img: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=2070&auto=format&fit=crop" },
            { title: "Bali", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1938&auto=format&fit=crop" }
          ].map((dest) => (
            <div key={dest.title} className="group relative h-96 rounded-2xl overflow-hidden cursor-pointer">
              <Image
                src={dest.img}
                alt={dest.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <h3 className="text-3xl font-bold text-white mb-2">{dest.title}</h3>
                <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                  <span className="text-amber-400 font-medium">Explore Packages</span>
                  <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-black">
                    →
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

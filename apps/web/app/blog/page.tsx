import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Travel Blog | MoonRidge",
  description:
    "Explore our travel stories, destination guides, tips and inspiration for your next adventure.",
};

import CreateBlogButton from "@/components/blog/CreateBlogButton";
import NewsletterForm from "@/components/blog/NewsletterForm";

async function getBlogs() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    return [];
  }
}

const CATEGORIES = ["All", "Destination Guide", "Travel Tips", "Adventure", "Food & Culture", "Journal"];

const CATEGORY_COLORS: Record<string, string> = {
  "Destination Guide": "bg-green-500/20 text-green-300 border-green-500/30",
  "Travel Tips": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  "Adventure": "bg-orange-500/20 text-orange-300 border-orange-500/30",
  "Food & Culture": "bg-purple-500/20 text-purple-300 border-purple-500/30",
};

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const categoryParam = resolvedSearchParams.category || "All";

  let blogs = await getBlogs();
  if (categoryParam !== "All") {
    blogs = blogs.filter((b: any) => b.category === categoryParam);
  }

  const featured = blogs.length > 0 ? blogs[0] : null;
  const rest = blogs.length > 0 ? blogs.slice(1) : [];

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero ── */}
      <section className="relative h-72 flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1920&auto=format&fit=crop"
          alt="Blog hero"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-background" />
        <div className="relative z-10 text-center px-4">
          <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-3">
            Stories &amp; Guides
          </p>
          <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
            The MoonRidge{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500">
              Journal
            </span>
          </h1>
          <p className="mt-4 text-gray-300 text-lg max-w-xl mx-auto mb-6">
            Destination deep-dives, insider tips, and travel stories from our explorers.
          </p>
          <CreateBlogButton />
        </div>
      </section>

      {/* ── Category Pills ── */}
      <section className="sticky top-16 z-30 bg-background/95 backdrop-blur border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map((cat) => {
            const isActive = categoryParam === cat;
            return (
              <Link
                key={cat}
                href={cat === "All" ? "/blog" : `/blog?category=${encodeURIComponent(cat)}`}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  isActive
                    ? "bg-amber-500 text-black border-transparent"
                    : "border-border/60 text-muted-foreground hover:border-amber-500/50 hover:text-amber-400"
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">

        <section>
          <p className="text-xs text-amber-500 font-bold uppercase tracking-widest mb-8">
            Latest Articles
          </p>
          {blogs.length === 0 ? (
            <p className="text-muted-foreground text-center py-20">No blogs found.</p>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((post: any) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col rounded-2xl overflow-hidden border border-border/50 hover:border-amber-500/40 bg-card/20 hover:bg-card/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1"
              >
                <div className="relative h-52 overflow-hidden bg-slate-800">
                  {post.thumbnail || post.cover ? (
                    <Image
                      src={post.thumbnail || post.cover}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-800" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span
                    className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold border ${CATEGORY_COLORS[post.category] ?? "bg-slate-500/20 text-slate-300 border-slate-500/30"}`}
                  >
                    {post.category}
                  </span>
                </div>

                <div className="flex flex-col flex-1 p-6">
                  <h3 className="font-bold text-lg leading-snug mb-3 group-hover:text-amber-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  {(post.tripLocation || post.tripDate) && (
                    <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
                      {post.tripLocation && (
                        <span className="flex items-center gap-1">
                          <span className="text-amber-500">📍</span> {post.tripLocation}
                        </span>
                      )}
                      {post.tripDate && (
                        <span className="flex items-center gap-1">
                          <span className="text-amber-500">📅</span> {post.tripDate}
                        </span>
                      )}
                    </div>
                  )}
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-6">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto flex items-center gap-2.5">
                    {post.authorAvatar ? (
                      <Image
                        src={post.authorAvatar}
                        alt={post.author}
                        width={28}
                        height={28}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-[10px] uppercase">{post.author?.charAt(0) || "A"}</div>
                    )}
                    <div>
                      <p className="text-xs font-medium">{post.author}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(post.createdAt || new Date()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · {post.readTime || "5 min read"}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          )}
        </section>

        {/* ── Newsletter CTA ── */}
        <section className="mt-24 rounded-3xl bg-gradient-to-br from-amber-500/10 via-background to-background border border-amber-500/20 p-10 md:p-16 text-center">
          <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-3">
            Stay Inspired
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get Travel Stories in Your Inbox
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            New destination guides, trip hacks and exclusive MoonRidge deals — delivered every two weeks.
          </p>
          <NewsletterForm />
        </section>
      </div>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdminEditButton from "@/components/blog/AdminEditButton";

async function getBlogBySlug(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/slug/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      console.error("Failed to fetch blog:", res.statusText);
      throw new Error("Failed to fetch blog");
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
}

export default async function SingleBlogPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="relative h-[60vh] min-h-[400px] flex items-end pb-16 justify-center overflow-hidden">
        {blog.cover || blog.thumbnail ? (
          <Image
            src={blog.cover || blog.thumbnail}
            alt={blog.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-slate-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />

        <div className="relative z-10 w-full max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500 text-black">
              {blog.category}
            </span>
            <span className="text-muted-foreground text-sm flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              {blog.readTime || "5 min read"}
            </span>
            {blog.status === "draft" && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                DRAFT PREVIEW
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6 leading-tight">
            {blog.title}
          </h1>

          <div className="flex items-center gap-4">
            {blog.authorAvatar ? (
              <Image
                src={blog.authorAvatar}
                alt={blog.author}
                width={48}
                height={48}
                className="rounded-full object-cover border-2 border-border"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-lg font-bold border-2 border-border">
                {blog.author?.charAt(0) || "A"}
              </div>
            )}
            <div>
              <p className="font-medium text-white">{blog.author || "Admin"}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(blog.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </p>
            </div>
            <div className="ml-auto">
              <AdminEditButton slug={blog.slug} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        {blog.excerpt && (
          <p className="text-xl text-muted-foreground leading-relaxed mb-12 font-medium italic border-l-4 border-amber-500 pl-6">
            {blog.excerpt}
          </p>
        )}

        <div className="prose prose-invert prose-amber max-w-none">
          {/* Simple rendering for now. In a real app, use react-markdown */}
          <div className="whitespace-pre-wrap font-sans leading-loose text-slate-300">
            {blog.content}
          </div>
        </div>
      </section>
    </div>
  );
}

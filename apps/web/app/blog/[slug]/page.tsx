import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import AdminEditButton from "@/components/blog/AdminEditButton";
import BlockRenderer from "@/components/blog/BlockRenderer";
import type { ContentBlock } from "@/lib/blog-types";
import { MapPin, Clock, Calendar } from "lucide-react";
import Link from "next/link";

async function getBlogBySlug(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/slug/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error("Failed to fetch blog");
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
}

// ── SEO metadata ──────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) return { title: "Article Not Found | MoonRidge" };

  const image = blog.ogImage || blog.cover || blog.thumbnail;

  return {
    title: blog.seoTitle || `${blog.title} | MoonRidge`,
    description: blog.seoDescription || blog.excerpt,
    alternates: { canonical: blog.canonicalUrl },
    openGraph: {
      title: blog.seoTitle || blog.title,
      description: blog.seoDescription || blog.excerpt,
      type: "article",
      publishedTime: blog.createdAt,
      modifiedTime: blog.updatedAt,
      authors: [blog.author || "MoonRidge"],
      images: image ? [{ url: image, width: 1200, height: 630, alt: blog.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.seoTitle || blog.title,
      description: blog.seoDescription || blog.excerpt,
      images: image ? [image] : [],
    },
  };
}

// ── JSON-LD Structured Data ───────────────────────────────────

function ArticleJsonLd({ blog }: { blog: any }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    description: blog.excerpt,
    image: blog.ogImage || blog.cover || blog.thumbnail,
    author: {
      "@type": "Person",
      name: blog.author || "MoonRidge",
    },
    publisher: {
      "@type": "Organization",
      name: "MoonRidge Adventures",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/logo.png`,
      },
    },
    datePublished: blog.createdAt,
    dateModified: blog.updatedAt || blog.createdAt,
    url: blog.canonicalUrl,
    articleSection: blog.category,
    keywords: blog.category,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ── Page ──────────────────────────────────────────────────────

export default async function SingleBlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  const hasBlocks = blog.contentBlocks && blog.contentBlocks.length > 0;

  return (
    <>
      <ArticleJsonLd blog={blog} />

      <div className="min-h-screen bg-background">
        {/* ── Cover Hero ── */}
        <section className="relative h-[65vh] min-h-[420px] flex items-end pb-16 justify-center overflow-hidden">
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
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-transparent" />

          <div className="relative z-10 w-full max-w-4xl mx-auto px-4">
            {/* Badges */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500 text-black">
                {blog.category}
              </span>
              {blog.readTime && (
                <span className="text-muted-foreground text-sm flex items-center gap-1.5">
                  <Clock size={13} className="text-amber-500" />
                  {blog.readTime}
                </span>
              )}
              {blog.tripLocation && (
                <span className="text-muted-foreground text-sm flex items-center gap-1.5">
                  <MapPin size={13} className="text-amber-500" />
                  {blog.tripLocation}
                </span>
              )}
              {blog.tripDate && (
                <span className="text-muted-foreground text-sm flex items-center gap-1.5">
                  <Calendar size={13} className="text-amber-500" />
                  {blog.tripDate}
                </span>
              )}
              {blog.status === "draft" && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                  DRAFT PREVIEW
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6 leading-tight">
              {blog.title}
            </h1>

            {/* Author row */}
            <div className="flex items-center gap-4">
              {blog.authorAvatar ? (
                <Image
                  src={blog.authorAvatar}
                  alt={blog.author}
                  width={48}
                  height={48}
                  className="rounded-full object-cover border-2 border-amber-500/50"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-amber-500/20 border-2 border-amber-500/40 flex items-center justify-center text-amber-400 text-lg font-bold">
                  {blog.author?.charAt(0) || "A"}
                </div>
              )}
              <div>
                <p className="font-medium text-white">{blog.author || "Admin"}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(blog.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                  {blog.travelRoute && ` · ${blog.travelRoute}`}
                </p>
              </div>
              <div className="ml-auto">
                <AdminEditButton slug={blog.slug} />
              </div>
            </div>
          </div>
        </section>

        {/* ── Excerpt ── */}
        {blog.excerpt && (
          <div className="max-w-4xl mx-auto px-4 pt-10">
            <p className="text-xl text-muted-foreground leading-relaxed font-medium italic border-l-4 border-amber-500 pl-6">
              {blog.excerpt}
            </p>
          </div>
        )}

        {/* ── Content Blocks ── */}
        <article className="max-w-4xl mx-auto px-4 py-10 pb-24">
          <BlockRenderer
            contentBlocks={hasBlocks ? (blog.contentBlocks as ContentBlock[]) : undefined}
            legacyContent={!hasBlocks ? blog.content : undefined}
          />
        </article>

        {/* ── Back to Blog ── */}
        <div className="max-w-4xl mx-auto px-4 pb-16 border-t border-border/30 pt-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-amber-400 transition-colors"
          >
            ← Back to Journal
          </Link>
        </div>
      </div>
    </>
  );
}

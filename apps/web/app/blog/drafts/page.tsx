"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/authStore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Edit } from "lucide-react";

export default function DraftsPage() {
  const { user, token } = useAuthStore();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!user || user.role !== "admin") {
      router.push("/blog");
      return;
    }

    const fetchDrafts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs?status=draft`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setBlogs(data);
        }
      } catch (err) {
        console.error("Failed to fetch drafts", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDrafts();
  }, [mounted, user, token, router]);

  if (!mounted || !user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-background py-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <div>
          <p className="text-amber-500 font-bold uppercase tracking-widest text-sm mb-2">Admin Only</p>
          <h1 className="text-4xl md:text-5xl font-bold">Draft Blogs</h1>
        </div>
        <Link href="/blog" className="text-muted-foreground hover:text-white transition-colors">
          &larr; Back to Published Blogs
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20 text-muted-foreground">Loading drafts...</div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800">
          <p className="text-xl text-slate-400 mb-4">No drafts found.</p>
          <Link href="/blog/create" className="text-amber-500 hover:underline">
            Create a new blog draft
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((post: any) => (
            <Link
              key={post.slug}
              href={`/blog/edit/${post.slug}`}
              className="group flex flex-col rounded-2xl overflow-hidden border border-amber-500/30 hover:border-amber-500 bg-card/20 hover:bg-card/50 transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden bg-slate-800">
                {post.cover || post.thumbnail ? (
                  <Image
                    src={post.cover || post.thumbnail}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-70"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-800" />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="px-3 py-1 bg-black/60 backdrop-blur-sm border border-amber-500/50 text-amber-500 font-bold tracking-widest text-xs uppercase rounded-full">
                    Draft
                  </span>
                </div>
              </div>

              <div className="flex flex-col flex-1 p-6 relative">
                <div className="absolute -top-6 right-6 bg-amber-500 text-black p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                  <Edit size={20} />
                </div>
                <span className="text-xs text-amber-500 font-bold uppercase tracking-wider mb-2">
                  {post.category}
                </span>
                <h3 className="font-bold text-lg leading-snug mb-3 text-white line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-4">
                  {post.excerpt || "No excerpt provided."}
                </p>
                <div className="mt-auto text-xs text-slate-500">
                  Last updated: {new Date(post.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/lib/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import BlockEditor from "@/components/blog/editor/BlockEditor";
import type { ContentBlock } from "@/lib/blog-types";

const CATEGORIES = ["Destination Guide", "Travel Tips", "Adventure", "Food & Culture", "Journal"];

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const { user, token } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    category: "Destination Guide",
    excerpt: "",
    thumbnail: "",
    cover: "",
    readTime: "5 min read",
    author: "",
    authorAvatar: "",
    featured: false,
    status: "draft",
    // SEO
    seoTitle: "",
    seoDescription: "",
    canonicalUrl: "",
    ogImage: "",
    // Journal
    tripDate: "",
    tripLocation: "",
    travelRoute: "",
  });

  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [blogId, setBlogId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState<"thumbnail" | "cover" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"content" | "seo" | "journal">("content");

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (mounted && user?.role !== "admin") { router.push("/blog"); return; }
    if (mounted && slug) fetchBlog();
  }, [mounted, user, router, slug]);

  const fetchBlog = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/slug/${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch blog");
      const data = await res.json();
      setBlogId(data._id);
      setForm({
        title: data.title || "",
        slug: data.slug || "",
        category: data.category || "Destination Guide",
        excerpt: data.excerpt || "",
        thumbnail: data.thumbnail || "",
        cover: data.cover || "",
        readTime: data.readTime || "5 min read",
        author: data.author || "",
        authorAvatar: data.authorAvatar || "",
        featured: data.featured || false,
        status: data.status || "draft",
        seoTitle: data.seoTitle || "",
        seoDescription: data.seoDescription || "",
        canonicalUrl: data.canonicalUrl || "",
        ogImage: data.ogImage || "",
        tripDate: data.tripDate || "",
        tripLocation: data.tripLocation || "",
        travelRoute: data.travelRoute || "",
      });
      // Load contentBlocks — migrate legacy content if needed
      if (data.contentBlocks && data.contentBlocks.length > 0) {
        setContentBlocks(data.contentBlocks);
      } else if (data.content) {
        // Migrate: wrap legacy string in a paragraph block
        setContentBlocks([{ type: "paragraph", content: data.content }]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || user?.role !== "admin") return null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground text-sm">Loading article...</p>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "thumbnail" | "cover") => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(field);
    setError(null);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/packages/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to upload image");
      const data = await res.json();
      setForm((prev) => ({ ...prev, [field]: data.url }));
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
    } finally {
      setUploading(null);
    }
  };

  const handleSave = async (e: React.FormEvent, newStatus?: "draft" | "published") => {
    e.preventDefault();
    if (!blogId) return;
    if (newStatus === "published") setPublishing(true);
    else setSaving(true);
    setError(null);
    const payload = { ...form, contentBlocks };
    if (newStatus) payload.status = newStatus;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${blogId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update blog");
      }
      const data = await res.json();
      setForm((prev) => ({ ...prev, status: data.status }));
      if (newStatus === "published") {
        router.push(`/blog/${data.slug}`);
      }
    } catch (err: any) {
      setError(err.message || "Failed to save blog");
    } finally {
      if (newStatus === "published") setPublishing(false);
      else setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!blogId || !window.confirm("Delete this article permanently? This cannot be undone.")) return;
    setDeleting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${blogId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete blog");
      router.push("/blog");
    } catch (err: any) {
      setError(err.message || "Failed to delete blog");
      setDeleting(false);
    }
  };

  const tabClass = (tab: string) =>
    `px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
      activeTab === tab
        ? "bg-amber-500 text-black"
        : "text-slate-400 hover:text-white hover:bg-slate-800"
    }`;

  return (
    <div className="min-h-screen bg-background py-20 px-4 md:px-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
        <div>
          <p className="text-amber-500 font-bold uppercase tracking-widest text-xs mb-2">Admin Editor</p>
          <h1 className="text-4xl font-bold">Edit Article</h1>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          form.status === "published"
            ? "bg-green-500/20 text-green-400 border border-green-500/30"
            : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
        }`}>
          {form.status.toUpperCase()}
        </span>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={(e) => handleSave(e)} className="space-y-8">
        {/* Metadata */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl space-y-6">
          <h2 className="text-lg font-semibold text-white">Article Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Title</label>
              <Input name="title" value={form.title} onChange={handleChange} required className="bg-slate-950 border-slate-700 text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Slug</label>
              <Input name="slug" value={form.slug} onChange={handleChange} required className="bg-slate-950 border-slate-700 text-white font-mono text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="w-full h-10 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Read Time</label>
              <Input name="readTime" value={form.readTime} onChange={handleChange} className="bg-slate-950 border-slate-700 text-white" />
            </div>
            <div className="space-y-2 flex flex-col justify-end">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input name="featured" type="checkbox" checked={form.featured} onChange={handleChange} className="w-5 h-5 accent-amber-500" />
                <span className="text-sm font-medium text-slate-300">Featured Article</span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Excerpt</label>
            <Textarea name="excerpt" value={form.excerpt} onChange={handleChange} required rows={3} className="bg-slate-950 border-slate-700 text-white resize-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(["thumbnail", "cover"] as const).map((field) => (
              <div key={field} className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{field === "thumbnail" ? "Thumbnail Image" : "Cover Image"}</label>
                <div className="flex items-center gap-3">
                  {form[field] && <img src={form[field]} alt={field} className="w-16 h-16 object-cover rounded-lg border border-slate-700" />}
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, field)} disabled={uploading === field} className="w-full text-sm text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-black hover:file:bg-amber-400 disabled:opacity-50" />
                </div>
                {uploading === field && <p className="text-xs text-amber-500">Uploading...</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="flex gap-2 p-3 border-b border-slate-800">
            <button type="button" className={tabClass("content")} onClick={() => setActiveTab("content")}>✍ Content Blocks</button>
            <button type="button" className={tabClass("seo")} onClick={() => setActiveTab("seo")}>🔍 SEO</button>
            <button type="button" className={tabClass("journal")} onClick={() => setActiveTab("journal")}>📓 Journal</button>
          </div>

          <div className="p-6">
            {activeTab === "content" && (
              <BlockEditor blocks={contentBlocks} onChange={setContentBlocks} token={token || ""} />
            )}

            {activeTab === "seo" && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">SEO Title</label>
                  <Input name="seoTitle" value={form.seoTitle} onChange={handleChange} className="bg-slate-950 border-slate-700 text-white" placeholder="Best Ladakh Travel Guide 2025 | MoonRidge" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Meta Description</label>
                  <Textarea name="seoDescription" value={form.seoDescription} onChange={handleChange} rows={3} className="bg-slate-950 border-slate-700 text-white resize-none" placeholder="150-160 character description..." />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Canonical URL</label>
                  <Input name="canonicalUrl" value={form.canonicalUrl} onChange={handleChange} className="bg-slate-950 border-slate-700 text-white" placeholder="https://moonridge.in/blog/..." />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">OpenGraph Image URL</label>
                  <Input name="ogImage" value={form.ogImage} onChange={handleChange} className="bg-slate-950 border-slate-700 text-white" placeholder="https://... (1200×630 recommended)" />
                </div>
              </div>
            )}

            {activeTab === "journal" && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Trip Date / Period</label>
                  <Input name="tripDate" value={form.tripDate} onChange={handleChange} className="bg-slate-950 border-slate-700 text-white" placeholder="May 10–16, 2025" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Trip Location</label>
                  <Input name="tripLocation" value={form.tripLocation} onChange={handleChange} className="bg-slate-950 border-slate-700 text-white" placeholder="Leh, Ladakh" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Travel Route</label>
                  <Input name="travelRoute" value={form.travelRoute} onChange={handleChange} className="bg-slate-950 border-slate-700 text-white" placeholder="Delhi → Manali → Leh → Pangong" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={saving || publishing || deleting}
            className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
          >
            {deleting ? "Deleting..." : "Delete Article"}
          </Button>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="border-slate-700 hover:bg-slate-800"
              onClick={() => router.push(`/blog/${form.slug}`)}
            >
              View Article
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={saving || publishing || deleting}
              className="border-amber-500/60 text-amber-400 hover:bg-amber-500/10"
              onClick={(e) => handleSave(e, "draft")}
            >
              {saving ? "Saving..." : "Save Draft"}
            </Button>
            <Button
              type="button"
              disabled={saving || publishing || deleting}
              className="bg-amber-500 hover:bg-amber-400 text-black font-bold"
              onClick={(e) => handleSave(e, "published")}
            >
              {publishing ? "Publishing..." : "Publish"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

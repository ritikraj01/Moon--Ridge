"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function CreateBlogPage() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    category: "Destination Guide",
    excerpt: "",
    content: "",
    thumbnail: "",
    cover: "",
    readTime: "5 min read",
    author: "",
    authorAvatar: "",
    featured: false,
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<"thumbnail" | "cover" | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && user?.role !== "admin") {
      router.push("/blog");
    }
    if (mounted && user) {
      setForm((prev) => ({ ...prev, author: user.name || "Admin" }));
    }
  }, [mounted, user, router]);

  if (!mounted || user?.role !== "admin") return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));

    if (name === "title") {
      setForm((prev) => ({
        ...prev,
        title: value,
        slug: value
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-"),
      }));
    }
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await res.json();
      setForm((prev) => ({ ...prev, [field]: data.url }));
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
    } finally {
      setUploading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create blog draft");
      }

      const data = await res.json();
      router.push(`/blog/${data.slug}/edit`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-20 px-4 md:px-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Create New Blog Draft</h1>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Title</label>
            <Input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="bg-slate-950 border-slate-800 text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Slug</label>
            <Input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              required
              className="bg-slate-950 border-slate-800 text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full h-10 px-3 py-2 bg-slate-950 border border-slate-800 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="Destination Guide">Destination Guide</option>
              <option value="Travel Tips">Travel Tips</option>
              <option value="Adventure">Adventure</option>
              <option value="Food & Culture">Food & Culture</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Read Time</label>
            <Input
              name="readTime"
              value={form.readTime}
              onChange={handleChange}
              className="bg-slate-950 border-slate-800 text-white"
            />
          </div>
          <div className="space-y-2 flex flex-col justify-end">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                name="featured"
                type="checkbox"
                checked={form.featured}
                onChange={handleChange}
                className="w-5 h-5 accent-amber-500"
              />
              <span className="text-sm font-medium text-slate-300">Featured Article</span>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Excerpt</label>
          <Textarea
            name="excerpt"
            value={form.excerpt}
            onChange={handleChange}
            required
            rows={3}
            className="bg-slate-950 border-slate-800 text-white resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Content (Markdown/HTML)</label>
          <Textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            required
            rows={10}
            className="bg-slate-950 border-slate-800 text-white font-mono text-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Thumbnail Image</label>
            <div className="flex items-center gap-4">
              {form.thumbnail && (
                <img src={form.thumbnail} alt="Thumbnail" className="w-16 h-16 object-cover rounded-md border border-slate-700" />
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "thumbnail")}
                  disabled={uploading === "thumbnail"}
                  className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-500 file:text-black hover:file:bg-amber-600 disabled:opacity-50"
                />
              </div>
            </div>
            {uploading === "thumbnail" && <p className="text-xs text-amber-500 mt-1">Uploading...</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Cover Image</label>
            <div className="flex items-center gap-4">
              {form.cover && (
                <img src={form.cover} alt="Cover" className="w-16 h-16 object-cover rounded-md border border-slate-700" />
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "cover")}
                  disabled={uploading === "cover"}
                  className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-500 file:text-black hover:file:bg-amber-600 disabled:opacity-50"
                />
              </div>
            </div>
            {uploading === "cover" && <p className="text-xs text-amber-500 mt-1">Uploading...</p>}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            className="text-slate-400 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
          >
            {loading ? "Saving..." : "Save Draft"}
          </Button>
        </div>
      </form>
    </div>
  );
}

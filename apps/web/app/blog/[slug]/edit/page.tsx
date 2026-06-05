"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/lib/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
    content: "",
    thumbnail: "",
    cover: "",
    readTime: "5 min read",
    author: "",
    authorAvatar: "",
    featured: false,
    status: "draft",
  });

  const [blogId, setBlogId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState<"thumbnail" | "cover" | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && user?.role !== "admin") {
      router.push("/blog");
      return;
    }

    if (mounted && slug) {
      fetchBlog();
    }
  }, [mounted, user, router, slug]);

  const fetchBlog = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/slug/${slug}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch blog");
      const data = await res.json();
      setBlogId(data._id);
      setForm({
        title: data.title || "",
        slug: data.slug || "",
        category: data.category || "Destination Guide",
        excerpt: data.excerpt || "",
        content: data.content || "",
        thumbnail: data.thumbnail || "",
        cover: data.cover || "",
        readTime: data.readTime || "5 min read",
        author: data.author || "",
        authorAvatar: data.authorAvatar || "",
        featured: data.featured || false,
        status: data.status || "draft",
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

  const handleSave = async (e: React.FormEvent, newStatus?: "draft" | "published") => {
    e.preventDefault();
    if (!blogId) return;

    if (newStatus === "published") {
      setPublishing(true);
    } else {
      setSaving(true);
    }
    setError(null);

    const payload = { ...form };
    if (newStatus) {
      payload.status = newStatus;
    }

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
      } else {
        alert("Draft saved successfully!");
      }
    } catch (err: any) {
      setError(err.message || "Failed to save blog");
    } finally {
      if (newStatus === "published") setPublishing(false);
      else setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!blogId || !window.confirm("Are you sure you want to delete this blog? This cannot be undone.")) return;
    
    setDeleting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${blogId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete blog");
      }

      router.push("/blog");
    } catch (err: any) {
      setError(err.message || "Failed to delete blog");
      setDeleting(false);
    }
  };

  if (!mounted || user?.role !== "admin") return null;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background py-20 px-4 md:px-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Edit Blog</h1>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      <form className="space-y-6 bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
        <div className="flex items-center gap-4 mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${form.status === 'published' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
            Status: {form.status.toUpperCase()}
          </span>
        </div>

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

        <div className="pt-4 border-t border-slate-800 flex justify-between items-center gap-4">
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={loading || saving || publishing || deleting}
            className="bg-red-500/20 text-red-500 hover:bg-red-500/30 border-red-500/50"
          >
            {deleting ? "Deleting..." : "Delete Blog"}
          </Button>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              className="border-slate-700 hover:bg-slate-800"
              onClick={() => router.push(`/blog/${form.slug}`)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="outline"
              disabled={loading || saving || publishing || deleting}
              className="border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black"
              onClick={(e) => handleSave(e, "draft")}
            >
              {saving ? "Saving..." : "Save Draft"}
            </Button>
            <Button
              type="button"
              disabled={loading || saving || publishing || deleting}
              className="bg-amber-500 hover:bg-amber-400 text-black font-semibold"
              onClick={(e) => handleSave(e, "published")}
            >
              {publishing ? "Publishing..." : "Publish Blog"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

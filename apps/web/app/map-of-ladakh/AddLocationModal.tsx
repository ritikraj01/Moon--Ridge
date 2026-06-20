"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, X, Loader2, MapPin, Image as ImageIcon, Link2 } from "lucide-react";
import { useAuthStore } from "@/lib/authStore";
import { type LocationCategory } from "./location-data";

const CATEGORIES: { value: LocationCategory; label: string; emoji: string }[] = [
  { value: "city", label: "City", emoji: "🏘️" },
  { value: "lake", label: "Lake", emoji: "🌊" },
  { value: "pass", label: "Pass", emoji: "⛰️" },
  { value: "monastery", label: "Monastery", emoji: "🛕" },
  { value: "valley", label: "Valley", emoji: "🏔️" },
  { value: "school", label: "School", emoji: "🏫" },
  { value: "town", label: "Town", emoji: "🏘️" },
  { value: "permit", label: "Permit", emoji: "📄" },
];

const INITIAL: {
  name: string;
  slug: string;
  category: LocationCategory;
  latitude: string;
  longitude: string;
  altitude: string;
  distanceFromLeh: string;
  shortDescription: string;
  longDescription: string;
  bestTimeToVisit: string;
  highlights: string;
  nearbyAttractions: string;
  travelTips: string;
  relatedBlogs: string;
  relatedPackages: string;
} = {
  name: "",
  slug: "",
  category: "city",
  latitude: "",
  longitude: "",
  altitude: "",
  distanceFromLeh: "",
  shortDescription: "",
  longDescription: "",
  bestTimeToVisit: "",
  highlights: "",
  nearbyAttractions: "",
  travelTips: "",
  relatedBlogs: "",
  relatedPackages: "",
};

const parseList = (raw: string) =>
  raw.split("|").map((s) => s.trim()).filter(Boolean);


export default function AddLocationModal() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("basic");
  const [form, setForm] = useState(INITIAL);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted || user?.role !== "admin") return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (name === "name") {
      setForm((p) => ({
        ...p,
        name: value,
        slug: value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-"),
      }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/locations/upload`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd }
      );
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setImages((prev) => [...prev, data.url]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        name: form.name,
        slug: form.slug,
        category: form.category,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        altitude: form.altitude,
        distanceFromLeh: form.distanceFromLeh,
        shortDescription: form.shortDescription,
        longDescription: form.longDescription,
        bestTimeToVisit: form.bestTimeToVisit,
        images,
        highlights: parseList(form.highlights),
        nearbyAttractions: parseList(form.nearbyAttractions),
        travelTips: parseList(form.travelTips),
        relatedBlogs: parseList(form.relatedBlogs),
        relatedPackages: parseList(form.relatedPackages),
      };
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/locations`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || "Failed to create location");
      }
      setSuccess(true);
      setForm(INITIAL);
      setImages([]);
      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
        router.refresh();
      }, 1200);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-amber-500 focus-visible:border-amber-500";
  const labelCls = "text-slate-300 font-medium";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-amber-500 hover:bg-amber-600 text-black font-semibold flex items-center gap-2">
          <Plus size={16} /> Add Location
        </Button>
      </DialogTrigger>

      <DialogContent aria-describedby={undefined} className="max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-950 text-white border border-slate-900 rounded-2xl p-6 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <MapPin className="text-amber-500" size={22} /> Add New Location
          </DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
            <div className="text-6xl animate-bounce">🎉</div>
            <p className="text-2xl font-bold text-amber-500">Location Created!</p>
            <p className="text-sm text-slate-400">Refreshing map…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 mt-2">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="grid grid-cols-4 w-full bg-slate-900 border border-slate-800 p-1 mb-4 rounded-xl">
                {["basic", "gallery", "details", "related"].map((t) => (
                  <TabsTrigger
                    key={t}
                    value={t}
                    className="data-[state=active]:bg-amber-500 data-[state=active]:text-black text-xs font-bold py-2 rounded-lg transition-all capitalize"
                  >
                    {t}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* 1. Basic */}
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className={labelCls}>Name *</Label>
                    <Input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Pangong Lake" className={inputCls} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label className={labelCls}>Slug *</Label>
                    <Input name="slug" value={form.slug} onChange={handleChange} placeholder="auto-generated" className={inputCls} required />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className={labelCls}>Category *</Label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.emoji} {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className={labelCls}>Latitude *</Label>
                    <Input name="latitude" type="number" step="any" value={form.latitude} onChange={handleChange} placeholder="e.g. 33.7675" className={inputCls} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label className={labelCls}>Longitude *</Label>
                    <Input name="longitude" type="number" step="any" value={form.longitude} onChange={handleChange} placeholder="e.g. 78.6536" className={inputCls} required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className={labelCls}>Altitude</Label>
                    <Input name="altitude" value={form.altitude} onChange={handleChange} placeholder="e.g. 4,350 m" className={inputCls} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className={labelCls}>Distance from Leh</Label>
                    <Input name="distanceFromLeh" value={form.distanceFromLeh} onChange={handleChange} placeholder="e.g. 160 km" className={inputCls} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className={labelCls}>Best Time to Visit</Label>
                  <Input name="bestTimeToVisit" value={form.bestTimeToVisit} onChange={handleChange} placeholder="e.g. May to September" className={inputCls} />
                </div>

                <div className="space-y-1.5">
                  <Label className={labelCls}>Short Description *</Label>
                  <Textarea name="shortDescription" value={form.shortDescription} onChange={handleChange} rows={2} placeholder="One-line summary for cards and map popup" className={`${inputCls} resize-none`} required />
                </div>

                <div className="space-y-1.5">
                  <Label className={labelCls}>Full Description</Label>
                  <Textarea name="longDescription" value={form.longDescription} onChange={handleChange} rows={5} placeholder="Detailed description for the travel guide section" className={`${inputCls} resize-none`} />
                </div>
              </TabsContent>

              {/* 2. Gallery */}
              <TabsContent value="gallery" className="space-y-4">
                <p className="text-xs text-slate-500">Upload photos for this location.</p>
                <div className="grid grid-cols-3 gap-3">
                  {images.map((url, i) => (
                    <div key={i} className="relative group aspect-video rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImages((p) => p.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-video rounded-xl border border-dashed border-slate-700 hover:border-amber-500/50 bg-slate-900/30 flex flex-col items-center justify-center cursor-pointer transition-all">
                    <input type="file" accept="image/*" className="sr-only" onChange={handleImageUpload} disabled={uploading} />
                    {uploading ? (
                      <Loader2 size={20} className="text-amber-500 animate-spin" />
                    ) : (
                      <>
                        <Plus size={20} className="text-slate-500" />
                        <span className="text-[10px] text-slate-500 mt-1">Upload</span>
                      </>
                    )}
                  </label>
                </div>
              </TabsContent>

              {/* 3. Details */}
              <TabsContent value="details" className="space-y-4">
                <div className="space-y-1.5">
                  <Label className={labelCls}>Highlights <span className="text-xs text-slate-500">(comma-separated)</span></Label>
                  <Input name="highlights" value={form.highlights} onChange={handleChange} placeholder="e.g. Blue Lake, Photography, Camping" className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <Label className={labelCls}>Nearby Attractions <span className="text-xs text-slate-500">(comma-separated)</span></Label>
                  <Input name="nearbyAttractions" value={form.nearbyAttractions} onChange={handleChange} placeholder="e.g. Chang La, Spangmik Village" className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <Label className={labelCls}>Travel Tips <span className="text-xs text-slate-500">(comma-separated)</span></Label>
                  <Textarea name="travelTips" value={form.travelTips} onChange={handleChange} rows={4} placeholder="Tip 1, Tip 2, Tip 3..." className={`${inputCls} resize-none`} />
                </div>
              </TabsContent>

              {/* 4. Related */}
              <TabsContent value="related" className="space-y-4">
                <div className="space-y-1.5">
                  <Label className={labelCls}>Related Blog Slugs <span className="text-xs text-slate-500">(comma-separated)</span></Label>
                  <Input name="relatedBlogs" value={form.relatedBlogs} onChange={handleChange} placeholder="e.g. pangong-guide, best-time-ladakh" className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <Label className={labelCls}>Related Package Slugs <span className="text-xs text-slate-500">(comma-separated)</span></Label>
                  <Input name="relatedPackages" value={form.relatedPackages} onChange={handleChange} placeholder="e.g. leh-ladakh-tour, nubra-pangong" className={inputCls} />
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-900">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-amber-500 hover:bg-amber-600 text-black font-semibold flex items-center gap-2"
              >
                {loading && <Loader2 size={14} className="animate-spin" />}
                {loading ? "Creating…" : "Create Location"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

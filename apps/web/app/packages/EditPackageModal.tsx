"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Plus, 
  X, 
  Loader2, 
  Info, 
  Compass, 
  Layers, 
  HelpCircle, 
  Calendar,
  Pencil,
  Image as ImageIcon
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/authStore";

type FormState = {
  title: string;
  slug: string;
  destination: string;
  duration: string;
  description: string;
  highlights: string;
  inclusions: string;
  exclusions: string;
  pricing: string;
  numberOfPersons: string;
  availability: boolean;
};

type Plan = {
  name: string;
  price: string;
  numberOfPersons: string;
  features: string;
};

type ItineraryItem = {
  day: number;
  title: string;
  activities: string;
};

type FAQItem = {
  question: string;
  answer: string;
};

export default function EditPackageModal({ pkg }: { pkg: any }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  
  // Initialize states with existing package details
  const [form, setForm] = useState<FormState>({
    title: pkg.title || "",
    slug: pkg.slug || "",
    destination: pkg.destination || "",
    duration: String(pkg.duration || ""),
    description: pkg.description || "",
    highlights: pkg.highlights?.join(", ") || "",
    inclusions: pkg.inclusions?.join(", ") || "",
    exclusions: pkg.exclusions?.join(", ") || "",
    pricing: String(pkg.pricing || ""),
    numberOfPersons: String(pkg.numberOfPersons ?? 1),
    availability: pkg.availability !== undefined ? pkg.availability : true,
  });

  const [plans, setPlans] = useState<Plan[]>(
    pkg.plans?.length > 0
      ? pkg.plans.map((p: any) => ({
          name: p.name || "",
          price: String(p.price || ""),
          numberOfPersons: String(p.numberOfPersons ?? 1),
          features: p.features?.join(", ") || "",
        }))
      : [{ name: "", price: "", numberOfPersons: "2", features: "" }]
  );

  const [itinerary, setItinerary] = useState<ItineraryItem[]>(
    pkg.itinerary?.length > 0
      ? pkg.itinerary.map((it: any) => ({
          day: it.day || 1,
          title: it.title || "",
          activities: it.activities?.join(", ") || "",
        }))
      : [{ day: 1, title: "", activities: "" }]
  );

  const [faqs, setFaqs] = useState<FAQItem[]>(
    pkg.FAQs?.length > 0
      ? pkg.FAQs.map((f: any) => ({
          question: f.question || "",
          answer: f.answer || "",
        }))
      : [{ question: "", answer: "" }]
  );

  const [gallery, setGallery] = useState<string[]>(pkg.gallery || []);
  const [uploading, setUploading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { user, token } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || user?.role !== "admin") return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));

    // Auto-generate slug from title
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

  const parseList = (raw: string) =>
    raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

  const addPlan = () => {
    setPlans([...plans, { name: "", price: "", numberOfPersons: "2", features: "" }]);
  };

  const removePlan = (index: number) => {
    setPlans(plans.filter((_, i) => i !== index));
  };

  const handlePlanChange = (index: number, field: keyof Plan, value: string) => {
    setPlans(
      plans.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  };

  const addItineraryDay = () => {
    setItinerary([
      ...itinerary,
      { day: itinerary.length + 1, title: "", activities: "" }
    ]);
  };

  const removeItineraryDay = (index: number) => {
    const filtered = itinerary.filter((_, i) => i !== index);
    const reindexed = filtered.map((item, i) => ({ ...item, day: i + 1 }));
    setItinerary(reindexed);
  };

  const handleItineraryChange = (index: number, field: keyof ItineraryItem, value: string) => {
    setItinerary(
      itinerary.map((it, i) => (i === index ? { ...it, [field]: value } : it))
    );
  };

  const addFaq = () => {
    setFaqs([...faqs, { question: "", answer: "" }]);
  };

  const removeFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const handleFaqChange = (index: number, field: keyof FAQItem, value: string) => {
    setFaqs(
      faqs.map((f, i) => (i === index ? { ...f, [field]: value } : f))
    );
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/packages/upload`, {  
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await res.json();
      setGallery((prev) => [...prev, data.url]);
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setGallery((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const baseTravelers = Number(form.numberOfPersons);
    if (!Number.isFinite(baseTravelers) || baseTravelers < 1) {
      setError("Please enter a valid number of travelers for the base package");
      setActiveTab("basic");
      setLoading(false);
      return;
    }

    // Dynamic field validation
    for (let i = 0; i < plans.length; i++) {
      const plan = plans[i];
      if (!plan) continue;
      if (
        plan.name.trim() !== "" ||
        plan.price.trim() !== "" ||
        plan.numberOfPersons.trim() !== ""
      ) {
        if (!plan.name.trim()) {
          setError(`Please enter a name for Plan ${i + 1}`);
          setActiveTab("plans");
          setLoading(false);
          return;
        }
        if (!plan.price.trim()) {
          setError(`Please enter a total package price for Plan ${i + 1}`);
          setActiveTab("plans");
          setLoading(false);
          return;
        }
        const persons = Number(plan.numberOfPersons);
        if (!Number.isFinite(persons) || persons < 1) {
          setError(`Please enter a valid number of travelers for Plan ${i + 1}`);
          setActiveTab("plans");
          setLoading(false);
          return;
        }
      }
    }

    for (let i = 0; i < itinerary.length; i++) {
      const it = itinerary[i];
      if (!it) continue;
      if (it.title.trim() !== "" || it.activities.trim() !== "") {
        if (!it.title.trim()) {
          setError(`Please enter a title for Day ${it.day} itinerary`);
          setActiveTab("itinerary");
          setLoading(false);
          return;
        }
        if (!it.activities.trim()) {
          setError(`Please enter activities for Day ${it.day} itinerary`);
          setActiveTab("itinerary");
          setLoading(false);
          return;
        }
      }
    }

    for (let i = 0; i < faqs.length; i++) {
      const faq = faqs[i];
      if (!faq) continue;
      if (faq.question.trim() !== "" || faq.answer.trim() !== "") {
        if (!faq.question.trim()) {
          setError(`Please enter a question for FAQ ${i + 1}`);
          setActiveTab("faqs");
          setLoading(false);
          return;
        }
        if (!faq.answer.trim()) {
          setError(`Please enter an answer for FAQ ${i + 1}`);
          setActiveTab("faqs");
          setLoading(false);
          return;
        }
      }
    }

    // Filter and parse values
    const parsedPlans = plans
      .filter((p) => p.name.trim() !== "" && p.price.trim() !== "")
      .map((p) => ({
        name: p.name.trim(),
        price: Number(p.price) || 0,
        numberOfPersons: Math.max(1, Number(p.numberOfPersons) || 1),
        features: parseList(p.features),
      }));

    const parsedItinerary = itinerary
      .filter((it) => it.title.trim() !== "" && it.activities.trim() !== "")
      .map((it) => ({
        day: Number(it.day),
        title: it.title.trim(),
        activities: parseList(it.activities),
      }));

    const parsedFAQs = faqs
      .filter((faq) => faq.question.trim() !== "" && faq.answer.trim() !== "")
      .map((faq) => ({
        question: faq.question.trim(),
        answer: faq.answer.trim(),
      }));

    const payload = {
      title: form.title,
      slug: form.slug,
      destination: form.destination,
      duration: Number(form.duration),
      description: form.description,
      highlights: parseList(form.highlights),
      inclusions: parseList(form.inclusions),
      exclusions: parseList(form.exclusions),
      pricing: Number(form.pricing),
      numberOfPersons: Math.max(1, Number(form.numberOfPersons) || 1),
      availability: form.availability,
      plans: parsedPlans,
      itinerary: parsedItinerary,
      FAQs: parsedFAQs,
      gallery: gallery,
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/packages/${pkg._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update package");
      }

      setSuccess(true);
      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
        
        // If slug was updated, route to new URL
        if (payload.slug !== pkg.slug) {
          router.push(`/packages/${payload.slug}`);
        } else {
          router.refresh(); // Refresh in place to update server details
        }
      }, 1200);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-amber-500 hover:bg-amber-600 text-black font-semibold flex items-center gap-2 shadow-lg shadow-amber-950/20">
          <Pencil size={16} />
          Edit Package
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[95vw] md:max-w-5xl lg:max-w-6xl max-h-[92vh] overflow-y-auto bg-slate-950 text-white border border-slate-900 rounded-2xl p-6 shadow-2xl">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="text-amber-500">✏️</span> Edit Tour Package
          </DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
            <div className="text-6xl animate-bounce">🎉</div>
            <p className="text-2xl font-bold text-amber-500">
              Package Updated Successfully!
            </p>
            <p className="text-sm text-slate-400">
              Refreshing dashboard details...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 mt-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-6 w-full bg-slate-900 border border-slate-800/80 p-1 mb-6 rounded-xl">
                <TabsTrigger
                  value="basic"
                  className="data-[state=active]:bg-amber-500 data-[state=active]:text-black text-xs font-bold py-2.5 px-1 flex items-center justify-center gap-1.5 transition-all rounded-lg"
                >
                  <Info size={14} className="shrink-0" />
                  <span className="hidden sm:inline">Basic Info</span>
                </TabsTrigger>
                <TabsTrigger
                  value="highlights"
                  className="data-[state=active]:bg-amber-500 data-[state=active]:text-black text-xs font-bold py-2.5 px-1 flex items-center justify-center gap-1.5 transition-all rounded-lg"
                >
                  <Compass size={14} className="shrink-0" />
                  <span className="hidden sm:inline">Highlights</span>
                </TabsTrigger>
                <TabsTrigger
                  value="gallery"
                  className="data-[state=active]:bg-amber-500 data-[state=active]:text-black text-xs font-bold py-2.5 px-1 flex items-center justify-center gap-1.5 transition-all rounded-lg"
                >
                  <ImageIcon size={14} className="shrink-0" />
                  <span>Gallery ({gallery.length})</span>
                </TabsTrigger>
                <TabsTrigger
                  value="plans"
                  className="data-[state=active]:bg-amber-500 data-[state=active]:text-black text-xs font-bold py-2.5 px-1 flex items-center justify-center gap-1.5 transition-all rounded-lg"
                >
                  <Layers size={14} className="shrink-0" />
                  <span>Plans ({plans.filter(p => p.name.trim() !== "").length})</span>
                </TabsTrigger>
                <TabsTrigger
                  value="itinerary"
                  className="data-[state=active]:bg-amber-500 data-[state=active]:text-black text-xs font-bold py-2.5 px-1 flex items-center justify-center gap-1.5 transition-all rounded-lg"
                >
                  <Calendar size={14} className="shrink-0" />
                  <span>Itinerary ({itinerary.filter(i => i.title.trim() !== "").length})</span>
                </TabsTrigger>
                <TabsTrigger
                  value="faqs"
                  className="data-[state=active]:bg-amber-500 data-[state=active]:text-black text-xs font-bold py-2.5 px-1 flex items-center justify-center gap-1.5 transition-all rounded-lg"
                >
                  <HelpCircle size={14} className="shrink-0" />
                  <span>FAQs ({faqs.filter(f => f.question.trim() !== "").length})</span>
                </TabsTrigger>
              </TabsList>

              {/* TABS CONTENT */}
              
              {/* 1. BASIC DETAILS */}
              <TabsContent value="basic" className="space-y-4 outline-none">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="title" className="text-slate-300 font-medium flex items-center gap-1">
                      Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="e.g. Ladakh Adventure"
                      className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-amber-500 focus-visible:border-amber-500"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="slug" className="text-slate-300 font-medium">
                      Slug <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="slug"
                      name="slug"
                      value={form.slug}
                      onChange={handleChange}
                      placeholder="auto-generated from title"
                      className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-amber-500 focus-visible:border-amber-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="destination" className="text-slate-300 font-medium">
                      Destination <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="destination"
                      name="destination"
                      value={form.destination}
                      onChange={handleChange}
                      placeholder="e.g. Ladakh, India"
                      className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-amber-500 focus-visible:border-amber-500"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="duration" className="text-slate-300 font-medium">
                      Duration (days) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="duration"
                      name="duration"
                      type="number"
                      min={1}
                      value={form.duration}
                      onChange={handleChange}
                      placeholder="e.g. 7"
                      className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-amber-500 focus-visible:border-amber-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="description" className="text-slate-300 font-medium">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Write a short description of the package..."
                    rows={4}
                    className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-amber-500 focus-visible:border-amber-500 resize-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="pricing" className="text-slate-300 font-medium">
                      Base Package Price (₹) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="pricing"
                      name="pricing"
                      type="number"
                      min={0}
                      value={form.pricing}
                      onChange={handleChange}
                      placeholder="e.g. 55000"
                      className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-amber-500 focus-visible:border-amber-500"
                      required
                    />
                    <p className="text-[10px] text-slate-500">
                      Total price when no tiered plans are added
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="numberOfPersons" className="text-slate-300 font-medium">
                      Base Travelers <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="numberOfPersons"
                      name="numberOfPersons"
                      type="number"
                      min={1}
                      value={form.numberOfPersons}
                      onChange={handleChange}
                      placeholder="e.g. 2"
                      className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-amber-500 focus-visible:border-amber-500"
                      required
                    />
                    <p className="text-[10px] text-slate-500">
                      Travelers included in the base price
                    </p>
                  </div>
                  <div className="space-y-1.5 flex flex-col justify-end">
                    <label className="flex items-center gap-3 cursor-pointer select-none bg-slate-900 border border-slate-800 rounded-lg p-3 hover:bg-slate-900/80 transition-all">
                      <div className="relative">
                        <input
                          id="availability"
                          name="availability"
                          type="checkbox"
                          className="sr-only peer"
                          checked={form.availability}
                          onChange={handleChange}
                        />
                        <div className="w-11 h-6 rounded-full bg-slate-800 peer-checked:bg-amber-500 transition-colors" />
                        <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-slate-400 shadow transition-transform peer-checked:translate-x-5 peer-checked:bg-slate-950" />
                      </div>
                      <span className="text-sm font-medium text-slate-300">
                        {form.availability ? "Available for Bookings" : "Unavailable for Bookings"}
                      </span>
                    </label>
                  </div>
                </div>
                {form.pricing.trim() && form.numberOfPersons.trim() && (
                  <p className="text-xs text-amber-500/90 font-medium">
                    Base package: ₹{Number(form.pricing).toLocaleString("en-IN")} for{" "}
                    {form.numberOfPersons}{" "}
                    {Number(form.numberOfPersons) === 1 ? "Traveler" : "Travelers"}
                    {Number(form.numberOfPersons) > 0 && Number(form.pricing) > 0 && (
                      <>
                        {" "}
                        · ₹
                        {Math.round(
                          Number(form.pricing) / Number(form.numberOfPersons)
                        ).toLocaleString("en-IN")}{" "}
                        / person
                      </>
                    )}
                  </p>
                )}
              </TabsContent>

              {/* 2. HIGHLIGHTS & INCLUSIONS */}
              <TabsContent value="highlights" className="space-y-4 outline-none">
                <div className="space-y-1.5">
                  <Label htmlFor="highlights" className="text-slate-300 font-medium">
                    Highlights{" "}
                    <span className="text-xs text-slate-500">
                      (comma-separated lists)
                    </span>
                  </Label>
                  <Input
                    id="highlights"
                    name="highlights"
                    value={form.highlights}
                    onChange={handleChange}
                    placeholder="e.g. Pangong Lake, Khardung La, Nubra Valley"
                    className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-amber-500 focus-visible:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="inclusions" className="text-slate-300 font-medium">
                      Inclusions{" "}
                      <span className="text-xs text-slate-500">
                        (comma-separated)
                      </span>
                    </Label>
                    <Textarea
                      id="inclusions"
                      name="inclusions"
                      value={form.inclusions}
                      onChange={handleChange}
                      placeholder="e.g. Flights, Hotel, Meals, Tour Guide"
                      rows={4}
                      className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-amber-500 focus-visible:border-amber-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="exclusions" className="text-slate-300 font-medium">
                      Exclusions{" "}
                      <span className="text-xs text-slate-500">
                        (comma-separated)
                      </span>
                    </Label>
                    <Textarea
                      id="exclusions"
                      name="exclusions"
                      value={form.exclusions}
                      onChange={handleChange}
                      placeholder="e.g. Travel Insurance, Tips, Personal Expenses"
                      rows={4}
                      className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-amber-500 focus-visible:border-amber-500"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* 3. GALLERY */}
              <TabsContent value="gallery" className="space-y-4 outline-none">
                <div className="flex justify-between items-center pb-2 border-b border-slate-905">
                  <div>
                    <h3 className="text-sm font-semibold text-amber-500">Package Media Gallery</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Upload photos of the destination to attract travelers</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-h-[48vh] overflow-y-auto pr-1">
                  {gallery.map((url, idx) => (
                    <div key={idx} className="relative group aspect-video border border-slate-800 rounded-xl overflow-hidden bg-slate-900 shadow-inner animate-fade-in">
                      <img src={url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeImage(idx)}
                          className="text-red-500 hover:bg-red-500/20 hover:text-red-400 h-8 w-8 rounded-lg transition-all"
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {/* Upload Trigger */}
                  <label className="relative aspect-video border border-dashed border-slate-800 hover:border-amber-500/40 bg-slate-900/20 hover:bg-slate-900/40 transition-all rounded-xl flex flex-col items-center justify-center cursor-pointer select-none group">
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                    {uploading ? (
                      <Loader2 size={24} className="text-amber-500 animate-spin" />
                    ) : (
                      <>
                        <Plus size={24} className="text-slate-500 group-hover:text-amber-500 transition-colors" />
                        <span className="text-[10px] text-slate-500 group-hover:text-slate-400 mt-1 font-semibold">Upload Photo</span>
                      </>
                    )}
                  </label>
                </div>
              </TabsContent>

              {/* 4. PLANS */}
              <TabsContent value="plans" className="space-y-4 outline-none">
                <div className="flex justify-between items-center pb-2 border-b border-slate-905">
                  <div>
                    <h3 className="text-sm font-semibold text-amber-500">Custom Packages & Pricing Plans</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Each plan is a fixed total price for a set number of travelers
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addPlan}
                    className="border-amber-500/20 text-amber-500 bg-amber-500/5 hover:bg-amber-500 hover:text-black flex items-center gap-1.5 transition-all text-xs font-semibold"
                  >
                    <Plus size={14} /> Add Plan
                  </Button>
                </div>

                {plans.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-500 border border-dashed border-slate-900 rounded-xl bg-slate-900/20">
                    <Layers size={36} className="text-slate-700 mb-2 stroke-[1.5]" />
                    <p className="text-sm font-medium">No plans configured yet</p>
                    <p className="text-xs text-slate-600 mt-0.5">The tour will only be bookable at the base price.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[48vh] overflow-y-auto pr-1">
                    {plans.map((plan, idx) => (
                      <div key={idx} className="relative border border-slate-900 bg-slate-900/40 hover:border-amber-500/20 transition-all rounded-xl p-4 space-y-4 shadow-inner">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removePlan(idx)}
                          className="absolute top-2 right-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 h-7 w-7 transition-all rounded-lg"
                        >
                          <X size={14} />
                        </Button>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-slate-400">Plan Name</Label>
                            <Input
                              value={plan.name}
                              onChange={(e) => handlePlanChange(idx, "name", e.target.value)}
                              placeholder="e.g. Budget / Standard"
                              className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-amber-500 focus-visible:border-amber-500 text-xs h-9"
                              required
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-slate-400">
                              Total Package Price (₹)
                            </Label>
                            <Input
                              type="number"
                              min={0}
                              value={plan.price}
                              onChange={(e) => handlePlanChange(idx, "price", e.target.value)}
                              placeholder="e.g. 55000"
                              className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-amber-500 focus-visible:border-amber-500 text-xs h-9"
                              required
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-slate-400">
                              Number of Travelers
                            </Label>
                            <Input
                              type="number"
                              min={1}
                              value={plan.numberOfPersons}
                              onChange={(e) =>
                                handlePlanChange(idx, "numberOfPersons", e.target.value)
                              }
                              placeholder="e.g. 2"
                              className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-amber-500 focus-visible:border-amber-500 text-xs h-9"
                              required
                            />
                          </div>
                        </div>
                        {plan.price.trim() && plan.numberOfPersons.trim() && (
                          <p className="text-xs text-amber-500/90 font-medium">
                            ₹{Number(plan.price).toLocaleString("en-IN")} for{" "}
                            {plan.numberOfPersons}{" "}
                            {Number(plan.numberOfPersons) === 1 ? "Traveler" : "Travelers"}
                            {Number(plan.numberOfPersons) > 0 && Number(plan.price) > 0 && (
                              <>
                                {" "}
                                · ₹
                                {Math.round(
                                  Number(plan.price) / Number(plan.numberOfPersons)
                                ).toLocaleString("en-IN")}{" "}
                                / person
                              </>
                            )}
                          </p>
                        )}

                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold text-slate-400">Inclusions & Features (comma-separated)</Label>
                          <Textarea
                            value={plan.features}
                            onChange={(e) => handlePlanChange(idx, "features", e.target.value)}
                            placeholder="e.g. 5-Star Hotel, Private Sedan Tour, Flight Included"
                            rows={3}
                            className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-amber-500 focus-visible:border-amber-500 text-xs resize-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* 5. ITINERARY */}
              <TabsContent value="itinerary" className="space-y-4 outline-none">
                <div className="flex justify-between items-center pb-2 border-b border-slate-900">
                  <div>
                    <h3 className="text-sm font-semibold text-amber-500">Daywise Schedule</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Specify detailed schedules for each day of the journey</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addItineraryDay}
                    className="border-amber-500/20 text-amber-500 bg-amber-500/5 hover:bg-amber-500 hover:text-black flex items-center gap-1.5 transition-all text-xs font-semibold"
                  >
                    <Plus size={14} /> Add Day
                  </Button>
                </div>

                {itinerary.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-500 border border-dashed border-slate-900 rounded-xl bg-slate-900/20">
                    <Calendar size={36} className="text-slate-700 mb-2 stroke-[1.5]" />
                    <p className="text-sm font-medium">No days added to itinerary yet</p>
                    <p className="text-xs text-slate-600 mt-0.5">Click "Add Day" to start charting the traveler's adventure.</p>
                  </div>
                ) : (
                  <div className="space-y-3.5 max-h-[48vh] overflow-y-auto pr-1">
                    {itinerary.map((item, idx) => (
                      <div key={idx} className="relative border border-slate-900 bg-slate-900/40 hover:border-amber-500/20 transition-all rounded-xl p-4 flex flex-col gap-3.5 shadow-inner">
                        <div className="flex justify-between items-center">
                          <Badge className="bg-amber-500 text-black font-bold text-xs py-1 px-3 rounded-md">
                            Day {item.day}
                          </Badge>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItineraryDay(idx)}
                            className="text-slate-400 hover:text-red-500 hover:bg-red-500/10 h-7 w-7 transition-all rounded-lg"
                          >
                            <X size={14} />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-slate-400">Day Title</Label>
                            <Input
                              value={item.title}
                              onChange={(e) => handleItineraryChange(idx, "title", e.target.value)}
                              placeholder="e.g. Arrival in Leh & Hotel Check-in"
                              className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-amber-500 focus-visible:border-amber-500 text-xs h-9"
                              required
                            />
                          </div>

                          <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-slate-400">Day Activities (comma-separated)</Label>
                            <Input
                              value={item.activities}
                              onChange={(e) => handleItineraryChange(idx, "activities", e.target.value)}
                              placeholder="e.g. Airport Transfer, Hotel Welcome, Rest & Acclimatization"
                              className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-amber-500 focus-visible:border-amber-500 text-xs h-9"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* 6. FAQs */}
              <TabsContent value="faqs" className="space-y-4 outline-none">
                <div className="flex justify-between items-center pb-2 border-b border-slate-900">
                  <div>
                    <h3 className="text-sm font-semibold text-amber-500">Frequently Asked Questions</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Provide answers to common queries for this travel package</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addFaq}
                    className="border-amber-500/20 text-amber-500 bg-amber-500/5 hover:bg-amber-500 hover:text-black flex items-center gap-1.5 transition-all text-xs font-semibold"
                  >
                    <Plus size={14} /> Add FAQ
                  </Button>
                </div>

                {faqs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-500 border border-dashed border-slate-900 rounded-xl bg-slate-900/20">
                    <HelpCircle size={36} className="text-slate-700 mb-2 stroke-[1.5]" />
                    <p className="text-sm font-medium">No FAQs added yet</p>
                    <p className="text-xs text-slate-600 mt-0.5">Help travelers resolve quick doubts before booking.</p>
                  </div>
                ) : (
                  <div className="space-y-3.5 max-h-[48vh] overflow-y-auto pr-1">
                    {faqs.map((faq, idx) => (
                      <div key={idx} className="relative border border-slate-900 bg-slate-900/40 hover:border-amber-500/20 transition-all rounded-xl p-4 space-y-3.5 shadow-inner">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFaq(idx)}
                          className="absolute top-2 right-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 h-7 w-7 transition-all rounded-lg"
                        >
                          <X size={14} />
                        </Button>

                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold text-slate-400">Question</Label>
                          <Input
                            value={faq.question}
                            onChange={(e) => handleFaqChange(idx, "question", e.target.value)}
                            placeholder="e.g. Is high-altitude sickness common in Ladakh?"
                            className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-amber-500 focus-visible:border-amber-500 text-xs h-9"
                            required
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold text-slate-400">Answer</Label>
                          <Textarea
                            value={faq.answer}
                            onChange={(e) => handleFaqChange(idx, "answer", e.target.value)}
                            placeholder="e.g. Yes, acclimatization is key. Rest completely for the first 24-48 hours and stay hydrated."
                            rows={2}
                            className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-amber-500 focus-visible:border-amber-500 text-xs resize-none"
                            required
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {error && (
              <div className="text-xs text-red-400 bg-red-950/40 border border-red-900/30 rounded-xl px-4 py-3 flex items-start gap-2">
                <span className="text-red-500 text-sm">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div className="flex gap-3 pt-3 border-t border-slate-900">
              <Button
                type="submit"
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-bold h-10 transition-all rounded-lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin mr-2" />
                    Saving Changes...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
                className="border-slate-800 text-slate-300 hover:bg-slate-900 hover:text-white h-10 transition-all rounded-lg"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

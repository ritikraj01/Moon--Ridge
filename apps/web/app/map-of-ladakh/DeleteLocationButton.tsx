"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, Loader2 } from "lucide-react";
import { useAuthStore } from "@/lib/authStore";

interface DeleteLocationButtonProps {
  locationId: string;
  locationName: string;
}

export default function DeleteLocationButton({ locationId, locationName }: DeleteLocationButtonProps) {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);
  if (!mounted || user?.role !== "admin") return null;

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/locations/${locationId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || "Failed to delete");
      }
      setOpen(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          disabled={!locationId}
          title={!locationId ? "This location is not in the database yet" : "Delete location"}
          className="text-red-500 hover:bg-red-500/10 hover:text-red-400 flex items-center gap-1.5 text-xs font-semibold disabled:opacity-40 disabled:pointer-events-none"
        >
          <Trash2 size={12} /> Delete
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined} className="max-w-sm bg-slate-950 text-white border border-slate-900 rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-white">Delete Location</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-slate-400 mt-2">
          Are you sure you want to permanently delete{" "}
          <span className="text-white font-semibold">"{locationName}"</span>?
          This action cannot be undone.
        </p>
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm mt-3">
            {error}
          </div>
        )}
        <div className="flex items-center gap-3 mt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setOpen(false)}
            className="flex-1 text-slate-400 hover:text-white border border-slate-800"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={loading}
            onClick={handleDelete}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {loading ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuthStore } from "@/lib/authStore";
export default function DeletePackageButton({ pkgId, title }: { pkgId: string; title: string }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user, token } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || user?.role !== "admin") return null;

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/packages/${pkgId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete package");
      }

      setOpen(false);
      router.push("/packages");
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
        <Button variant="destructive" className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg shadow-red-950/20">
          <Trash2 size={16} />
          Delete Package
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-950 text-white border border-slate-900 rounded-2xl p-6 max-w-md">
        <DialogHeader className="flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-red-950/50 border border-red-500/20 flex items-center justify-center text-red-500 animate-pulse">
            <AlertTriangle size={24} />
          </div>
          <DialogTitle className="text-xl font-bold">Are you absolutely sure?</DialogTitle>
          <p className="text-sm text-slate-400">
            This action will permanently delete the package <strong className="text-white">"{title}"</strong> and all its associated booking configurations. This action cannot be undone.
          </p>
        </DialogHeader>

        {error && (
          <div className="text-xs text-red-400 bg-red-950/40 border border-red-900/30 rounded-xl px-4 py-3 flex items-start gap-2 mt-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <div className="flex gap-3 mt-4">
          <Button
            type="button"
            variant="destructive"
            className="flex-1 bg-red-600 hover:bg-red-700 font-bold"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Deleting...
              </>
            ) : (
              "Yes, Delete Package"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
            className="flex-1 border-slate-800 text-slate-300 hover:bg-slate-900 hover:text-white"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

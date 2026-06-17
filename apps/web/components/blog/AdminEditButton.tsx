"use client";

import { useAuthStore } from "@/lib/authStore";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminEditButton({ slug }: { slug: string }) {
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || user?.role !== "admin") return null;

  return (
    <Link href={`/blog/edit/${slug}`}>
      <Button variant="outline" className="border-amber-500/50 text-amber-500 hover:bg-amber-500 hover:text-black flex items-center gap-2">
        <Edit size={16} />
        Edit Blog
      </Button>
    </Link>
  );
}

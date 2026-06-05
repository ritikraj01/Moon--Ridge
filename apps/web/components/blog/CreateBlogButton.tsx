"use client";

import { useAuthStore } from "@/lib/authStore";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CreateBlogButton() {
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || user?.role !== "admin") return null;

  return (
    <div className="flex gap-4 justify-center mt-6">
      <Link href="/blog/create">
        <Button className="bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-full px-8 py-6 text-lg transition-transform hover:scale-105 shadow-xl shadow-amber-500/20">
          Create Blog
        </Button>
      </Link>
      <Link href="/blog/drafts">
        <Button variant="outline" className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300 font-semibold rounded-full px-8 py-6 text-lg transition-transform hover:scale-105">
          Manage Drafts
        </Button>
      </Link>
    </div>
  );
}

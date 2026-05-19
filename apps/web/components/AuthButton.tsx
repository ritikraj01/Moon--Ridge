"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/authStore";
import { LogOut, User as UserIcon } from "lucide-react";

export default function AuthButton() {
  const [mounted, setMounted] = useState(false);
  const { user, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
    router.refresh();
  };

  // Avoid hydration mismatch by rendering a skeleton / placeholder during SSR
  if (!mounted) {
    return (
      <Button 
        disabled
        className="hidden sm:inline-flex bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-transparent rounded-full px-6 py-2 select-none animate-pulse cursor-default border border-amber-500/10"
      >
        Sign In
      </Button>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        {user.name && (
          <span className="hidden lg:inline-flex items-center gap-2 text-xs text-amber-500 font-semibold bg-amber-500/5 border border-amber-500/10 py-1.5 px-3.5 rounded-full uppercase tracking-wider">
            <UserIcon className="w-3.5 h-3.5" />
            {user.name}
          </span>
        )}
        <Button 
          onClick={handleLogout}
          className="hidden sm:inline-flex bg-zinc-900 text-zinc-300 hover:text-red-400 border border-white/10 hover:border-red-500/20 hover:bg-red-500/10 transition-all duration-300 gap-2 items-center rounded-full px-5 py-2 hover:scale-[1.02] active:scale-[0.98]"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    );
  }

  return (
    <Link href="/login" passHref>
      <Button 
        className="hidden sm:inline-flex bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 rounded-full px-6 py-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
      >
        Sign In
      </Button>
    </Link>
  );
}

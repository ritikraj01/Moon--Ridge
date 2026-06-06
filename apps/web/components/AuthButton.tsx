"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/authStore";
import { LogOut, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AuthButton({ 
  className, 
  showOnMobile = false 
}: { 
  className?: string; 
  showOnMobile?: boolean;
}) {
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
        className={cn(
          "bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-transparent rounded-full px-6 py-2 select-none animate-pulse cursor-default border border-amber-500/10",
          showOnMobile ? "inline-flex" : "hidden sm:inline-flex",
          className
        )}
      >
        Sign In
      </Button>
    );
  }

  if (user) {
    return (
      <div className={cn(
        "flex gap-3",
        showOnMobile ? "flex-col w-full items-stretch" : "items-center"
      )}>
        {user.name && (
          <span className={cn(
            "items-center gap-2 text-xs text-amber-500 font-semibold bg-amber-500/5 border border-amber-500/10 py-1.5 px-3.5 rounded-full uppercase tracking-wider",
            showOnMobile ? "flex justify-center w-full py-2.5" : "hidden lg:flex"
          )}>
            <UserIcon className="w-3.5 h-3.5" />
            {user.name}
          </span>
        )}
        <Button 
          onClick={handleLogout}
          className={cn(
            "bg-zinc-900 text-zinc-300 hover:text-red-400 border border-white/10 hover:border-red-500/20 hover:bg-red-500/10 transition-all duration-300 gap-2 items-center rounded-full px-5 py-2 hover:scale-[1.02] active:scale-[0.98]",
            showOnMobile ? "flex w-full justify-center h-12" : "hidden sm:inline-flex",
            className
          )}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    );
  }

  return (
    <Button 
      asChild
      className={cn(
        "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 rounded-full px-6 py-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]",
        showOnMobile ? "inline-flex" : "hidden sm:inline-flex",
        className
      )}
    >
      <Link href="/login">
        Sign In
      </Link>
    </Button>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import AuthButton from "@/components/AuthButton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/packages", label: "Destinations" },
  { href: "/build-trip", label: "Customize Trip" },
  { href: "/blog", label: "Blog" },
];

export default function Navbar() {
  const pathname = usePathname();
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

  const formatWhatsAppNumber = (num: string) => {
    return num.startsWith("91") && num.length === 12
      ? `+91-${num.slice(2)}`
      : num.startsWith("+") ? num : `+${num}`;
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl mx-auto items-center justify-between px-4">
        {/* Brand Logo */}
        <Link href="/" className="font-bold text-2xl tracking-tighter text-amber-500">
          MOON<span className="text-white">RIDGE</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`hover:text-amber-500 transition-colors ${
                pathname === link.href ? "text-amber-500" : "text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Right Side CTA & Auth */}
        <div className="hidden md:flex items-center gap-4">
          {whatsappNumber && (
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/50 text-blue-500 hover:border-blue-500 hover:bg-blue-500/10 dark:border-blue-400/40 dark:text-blue-400 dark:hover:border-blue-400 dark:hover:bg-blue-400/10 transition-all text-xs font-semibold whitespace-nowrap shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 text-blue-500 dark:text-blue-400"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                <path d="M15.5 10.5a1 1 0 0 0-.7-.3c-.2 0-.4 0-.5.1l-.6.6c-.1.1-.2.1-.3 0a4 4 0 0 1-1.8-1.8c-.1-.1-.1-.2 0-.3l.6-.6c.1-.1.1-.3.1-.5 0-.2-.1-.5-.3-.7l-.8-.8c-.1-.1-.3-.2-.5-.2a1 1 0 0 0-.7.3l-1 1c-.3.3-.4.7-.2 1.1a8.5 8.5 0 0 0 4.2 4.2c.4.2.8.1 1.1-.2l1-1z" strokeWidth="1.5" />
              </svg>
              <span>{formatWhatsAppNumber(whatsappNumber)}</span>
            </a>
          )}
          <AuthButton />
        </div>

        {/* Mobile Navigation Menu */}
        <div className="flex md:hidden items-center gap-4">
          {whatsappNumber && (
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center p-2 rounded-full border border-blue-500/50 text-blue-500 hover:bg-blue-500/10 dark:border-blue-400/40 dark:text-blue-400 transition-all shadow-sm"
              aria-label="WhatsApp Contact"
            >
              <MessageSquare className="w-5 h-5 text-blue-500 dark:text-blue-400" />
            </a>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground focus-visible:ring-0">
                <Menu className="w-6 h-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] border-l border-zinc-800 bg-background p-6">
              <SheetHeader className="text-left border-b border-zinc-800/80 pb-4 mb-6">
                <SheetTitle className="font-bold text-2xl tracking-tighter text-amber-500">
                  MOON<span className="text-white">RIDGE</span>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-6">
                {/* Mobile Links */}
                <div className="flex flex-col gap-4">
                  {NAV_LINKS.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className={`text-lg font-medium hover:text-amber-500 transition-colors ${
                          pathname === link.href ? "text-amber-500" : "text-muted-foreground"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </div>

                <div className="border-t border-zinc-800/80 pt-6 mt-2 flex flex-col gap-4">
                  {whatsappNumber && (
                    <a
                      href={`https://wa.me/${whatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-blue-500/50 text-blue-500 hover:bg-blue-500/10 dark:border-blue-400/40 dark:text-blue-400 transition-all font-semibold shadow-sm"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-5 h-5"
                      >
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                        <path d="M15.5 10.5a1 1 0 0 0-.7-.3c-.2 0-.4 0-.5.1l-.6.6c-.1.1-.2.1-.3 0a4 4 0 0 1-1.8-1.8c-.1-.1-.1-.2 0-.3l.6-.6c.1-.1.1-.3.1-.5 0-.2-.1-.5-.3-.7l-.8-.8c-.1-.1-.3-.2-.5-.2a1 1 0 0 0-.7.3l-1 1c-.3.3-.4.7-.2 1.1a8.5 8.5 0 0 0 4.2 4.2c.4.2.8.1 1.1-.2l1-1z" strokeWidth="1.5" />
                      </svg>
                      <span>WhatsApp Support</span>
                    </a>
                  )}
                  <SheetClose asChild>
                    <AuthButton showOnMobile className="w-full py-3 h-12 flex justify-center text-sm font-semibold" />
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

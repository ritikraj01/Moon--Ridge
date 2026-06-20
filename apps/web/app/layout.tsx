import "@repo/ui/styles.css";
import "./globals.css";
import type { Metadata } from "next";
import { Geist } from "next/font/google";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MOONRIDGE",
  description: "MOONRIDGE ADVENTURES",
};
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

  return (
    <html lang="en" className="dark">
      <body className={`${geist.className} antialiased bg-background text-foreground`}>
        <Navbar />
        <main>{children}</main>

        {/* ── Footer ── */}
        <footer className="border-t border-border/40 bg-background/95 mt-auto">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

              {/* Brand */}
              <div className="md:col-span-1">
                <Link href="/" className="flex items-center gap-1 font-bold text-3xl tracking-tighter text-amber-500 group">
                  <Image
                    src="/moonridge-logo.svg"
                    alt="MoonRidge Logo"
                    width={48}
                    height={48}
                    className="object-contain mb-2.5"
                  />
                  <span className="mt-2.9">MOON<span className="text-white">RIDGE</span></span>
                </Link>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                  Curated Himalayan escapes and luxury travel experiences crafted for the modern explorer.
                </p>
                <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
                  Basgo village, Leh, Ladakh 194101<br />
                </p>
                <div className="flex gap-4 mt-6">
                  {/* Facebook */}
                  <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full border border-border/60 flex items-center justify-center text-muted-foreground hover:text-amber-500 hover:border-amber-500/50 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                  </a>
                  {/* Instagram */}
                  <a href="https://www.instagram.com/moonridgeadventure" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-full border border-border/60 flex items-center justify-center text-muted-foreground hover:text-amber-500 hover:border-amber-500/50 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                  </a>
                  {/* YouTube */}
                  <a href="#" aria-label="YouTube" className="w-9 h-9 rounded-full border border-border/60 flex items-center justify-center text-muted-foreground hover:text-amber-500 hover:border-amber-500/50 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" /><path d="m10 15 5-3-5-3z" /></svg>
                  </a>
                  {/* WhatsApp */}
                  <a href={whatsappNumber ? `https://wa.me/${whatsappNumber}` : "#"} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-9 h-9 rounded-full border border-border/60 flex items-center justify-center text-muted-foreground hover:text-amber-500 hover:border-amber-500/50 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
                  </a>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-widest">Explore</h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li><Link href="/packages" className="hover:text-amber-500 transition-colors">All Destinations</Link></li>
                  <li><Link href="/map-of-ladakh" className="hover:text-amber-500 transition-colors">Map of Ladakh</Link></li>
                  <li><Link href="/build-trip" className="hover:text-amber-500 transition-colors">Customize a Trip</Link></li>
                  <li><Link href="#" className="hover:text-amber-500 transition-colors">Honeymoon Packages</Link></li>
                  <li><Link href="#" className="hover:text-amber-500 transition-colors">Group Tours</Link></li>
                  <li><Link href="#" className="hover:text-amber-500 transition-colors">Adventure Treks</Link></li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-widest">Company</h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li><Link href="#" className="hover:text-amber-500 transition-colors">About Us</Link></li>
                  <li><Link href="/blog" className="hover:text-amber-500 transition-colors">Blog &amp; Journal</Link></li>
                  <li><Link href="#" className="hover:text-amber-500 transition-colors">Contact</Link></li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-widest">Support</h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li><Link href="#" className="hover:text-amber-500 transition-colors">Help Centre</Link></li>
                  <li><Link href="#" className="hover:text-amber-500 transition-colors">Cancellation Policy</Link></li>
                  <li><Link href="#" className="hover:text-amber-500 transition-colors">Privacy Policy</Link></li>
                  <li><Link href="#" className="hover:text-amber-500 transition-colors">Terms of Service</Link></li>
                </ul>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
              <p>© {new Date().getFullYear()} MoonRidge. All rights reserved.</p>
              <p>Made with ❤ for the mountains</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

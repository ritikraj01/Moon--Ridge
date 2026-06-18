"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/lib/firebase";
import { useAuthStore } from "@/lib/authStore";
import { Loader2, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      setLoading(true);
      const user = await signInWithGoogle();
      const token = await user.getIdToken();
      
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google`,
        { idToken: token }
      );
      
      setAuth(response.data.user, response.data.token);
      router.push("/");
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      setError(error.response?.data?.message || "Failed to sign up with Google");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) return;
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setError("");
      setLoading(true);
      
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/signup`,
        { name, email, password }
      );
      
      setAuth(response.data.user, response.data.token);
      router.push("/");
    } catch (error: any) {
      console.error("Email sign-up error:", error);
      setError(error.response?.data?.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 relative overflow-hidden py-12">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-amber-500/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-orange-600/10 blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md p-8 md:p-10 bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl z-10"
      >
        <div className="text-center mb-8 flex flex-col items-center">
          <Link href="/" className="flex flex-col items-center gap-3.5 mb-6 group">
            <div className="w-16 h-16 rounded-2xl bg-zinc-950/80 border border-amber-500/20 group-hover:border-amber-500/40 flex items-center justify-center p-2.5 shadow-xl transition-all duration-300">
              <Image
                src="/moonridge-logo.svg"
                alt="MoonRidge Logo"
                width={56}
                height={56}
                className="object-contain animate-pulse-slow"
              />
            </div>
            <span className="font-bold text-3xl tracking-tighter text-amber-500">
              MOON<span className="text-white">RIDGE</span>
            </span>
          </Link>
          <h1 className="text-2xl font-semibold text-white mb-2">Create an account</h1>
          <p className="text-zinc-400 text-sm">Sign up to get started</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailSignUp} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-xs font-medium text-zinc-400 ml-1">Full Name</label>
            <input 
              id="name"
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full h-12 px-4 bg-zinc-950/50 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-300"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-xs font-medium text-zinc-400 ml-1">Email Address</label>
            <input 
              id="email"
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full h-12 px-4 bg-zinc-950/50 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-300"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-xs font-medium text-zinc-400 ml-1">Password</label>
            <div className="relative">
              <input 
                id="password"
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-12 pl-4 pr-12 bg-zinc-950/50 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-300"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-xs font-medium text-zinc-400 ml-1">Confirm Password</label>
            <div className="relative">
              <input 
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"} 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-12 pl-4 pr-12 bg-zinc-950/50 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-300"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-12 bg-amber-500 text-black hover:bg-amber-600 rounded-xl font-medium transition-all duration-300 mt-2"
            disabled={loading || !name || !email || !password || !confirmPassword}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
          </Button>
        </form>

        <div className="relative flex items-center py-6">
          <div className="flex-grow border-t border-zinc-800"></div>
          <span className="flex-shrink-0 mx-4 text-zinc-500 text-xs">OR</span>
          <div className="flex-grow border-t border-zinc-800"></div>
        </div>

        <Button 
          type="button"
          variant="outline" 
          className="w-full h-12 bg-white text-black hover:bg-zinc-200 border-0 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-3 mb-6"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
            <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
          )}
          Continue with Google
        </Button>

        <p className="text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <Link href="/login" className="text-amber-500 hover:text-amber-400 transition-colors">
            Login
          </Link>
        </p>

      </motion.div>
    </div>
  );
}

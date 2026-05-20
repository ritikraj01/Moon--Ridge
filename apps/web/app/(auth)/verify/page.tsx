"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { completeMagicLink } from "@/lib/firebase";
import { useAuthStore } from "@/lib/authStore";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import axios from "axios";

export default function VerifyPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const verifyLink = async () => {
      try {
        const user = await completeMagicLink(window.location.href);
        if (user) {
          const token = await user.getIdToken();

          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/firebase`,
            {
              idToken: token,
              provider: 'email'
            }
          );

          setAuth(response.data.user, response.data.token);
          setStatus("success");

          setTimeout(() => {
            router.push("/");
          }, 1500);
        } else {
          setStatus("error");
          setErrorMessage("Invalid or expired link. Please try logging in again.");
        }
      } catch (error: any) {
        setStatus("error");
        setErrorMessage(error.message || "An error occurred during verification.");
      }
    };

    verifyLink();
  }, [router, setAuth]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-amber-500/5 blur-[150px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm p-8 bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl z-10 text-center"
      >
        {status === "loading" && (
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="w-16 h-16 border-4 border-zinc-800 border-t-amber-500 rounded-full animate-spin" />
            <h2 className="text-xl font-medium text-white">Verifying your link</h2>
            <p className="text-sm text-zinc-400">Please wait while we log you in...</p>
          </div>
        )}

        {status === "success" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center space-y-6"
          >
            <CheckCircle2 className="w-16 h-16 text-green-500" />
            <h2 className="text-xl font-medium text-white">Successfully logged in!</h2>
            <p className="text-sm text-zinc-400">Redirecting you to the dashboard...</p>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center space-y-6"
          >
            <XCircle className="w-16 h-16 text-red-500" />
            <h2 className="text-xl font-medium text-white">Verification Failed</h2>
            <p className="text-sm text-zinc-400">{errorMessage}</p>
            <button
              onClick={() => router.push("/login")}
              className="mt-4 px-6 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-zinc-200 transition-colors"
            >
              Back to Login
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

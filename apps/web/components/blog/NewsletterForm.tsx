"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/subscribers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to subscribe");
      }

      setStatus("success");
      setMessage("Thanks for subscribing! Keep an eye on your inbox.");
      setEmail("");
    } catch (error: any) {
      setStatus("error");
      setMessage(error.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto w-full">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          disabled={status === "loading"}
          className="flex-1 px-5 py-3 rounded-full bg-card border border-border focus:outline-none focus:border-amber-500 text-sm transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm transition-all hover:scale-105 disabled:opacity-50"
        >
          {status === "loading" ? "Subscribing..." : "Subscribe"}
        </button>
      </form>
      {status === "success" && <p className="text-sm text-green-400 mt-4 text-center">{message}</p>}
      {status === "error" && <p className="text-sm text-red-400 mt-4 text-center">{message}</p>}
    </div>
  );
}

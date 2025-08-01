"use client";
import { useState } from "react";

export default function FinalCTASection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitted(false);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong.");

      setSubmitted(true);
      setEmail("");
    } catch (err: any) {
      setError(err.message || "Failed to subscribe.");
    }
  };

  return (
    <section
      id="features"
      className="py-24 bg-white text-black text-center flex items-center justify-center min-h-[40vh] shadow-[0_-8px_24px_0_rgba(0,0,0,0.04)] -mt-4 relative z-10"
    >
      <div className="w-full max-w-2xl mx-auto px-6">
        <h2 className="text-4xl font-extrabold mb-4">Ready to boost your productivity?</h2>
        <p className="mb-10 text-lg text-black/80">Join NovaSync and be the first to experience AI-powered organization.</p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <input
            type="email"
            required
            placeholder="Enter your email"
            className="px-6 py-4 rounded-full border border-black w-full sm:w-auto"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setSubmitted(false);
              setError("");
            }}
            disabled={submitted}
          />
          <button
            type="submit"
            className="px-10 py-4 rounded-full bg-black text-white font-bold disabled:opacity-60"
            disabled={submitted}
          >
            {submitted ? "Thank you!" : "Join Now"}
          </button>
        </form>

        {submitted && <div className="mt-6 text-green-600">You're on the list! 🎉</div>}
        {error && <div className="mt-6 text-red-600">{error}</div>}
      </div>
    </section>
  );
}

"use client";
import { useState } from "react";

export default function FinalCTASection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setEmail("");
  };

  return (
    <section className="py-24 bg-white text-black text-center flex items-center justify-center min-h-[40vh] shadow-[0_-8px_24px_0_rgba(0,0,0,0.04)] -mt-4 relative z-10">
      <div className="w-full max-w-2xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight leading-tight">Ready to boost your productivity?</h2>
        <p className="mb-10 text-lg md:text-2xl text-black/80 font-medium">Join NovaSync and be the first to experience AI-powered organization.</p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 space-y-4 sm:space-y-0"
        >
          <input
            type="email"
            required
            placeholder="Enter your email"
            className="px-6 py-4 rounded-full bg-white text-black w-full sm:w-auto text-lg focus:outline-none focus:ring-4 focus:ring-black/20 transition-all duration-200 border border-black/30 placeholder:text-gray-500"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={submitted}
            aria-label="Email address"
          />
          <button
            type="submit"
            className="px-10 py-4 rounded-full bg-black text-white text-lg font-bold shadow hover:bg-white hover:text-black border-2 border-black transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black/20 disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto"
            disabled={submitted}
          >
            {submitted ? (
              <span className="flex items-center gap-2 justify-center">
                <svg className="w-6 h-6 text-green-500 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Thank you!
              </span>
            ) : (
              "Join Now"
            )}
          </button>
        </form>
        {submitted && (
          <div className="mt-6 text-green-600 text-lg animate-fade-in">You're on the list! 🎉</div>
        )}
      </div>
    </section>
  );
} 
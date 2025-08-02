"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Testimonial = {
  name: string;
  quote: string;
};

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch("/api/testimonials");
        if (!res.ok) throw new Error("Failed to fetch testimonials");
        const data = await res.json();
        setTestimonials(data);
      } catch (err) {
        console.error("Error loading testimonials:", (err as Error).message);
        setError("Unable to load testimonials at the moment.");
      }
    };

    fetchTestimonials();
  }, []);

  const loopedTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="py-20 bg-white shadow-[0_-8px_24px_0_rgba(0,0,0,0.04)] -mt-4 relative z-10 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500 opacity-10 blur-3xl rounded-full z-0" />
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-500 opacity-10 blur-3xl rounded-full z-0" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-black"
        >
          What Users Say
        </motion.h2>

        {error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
          <div className="relative w-full overflow-hidden">
            <motion.div
              className="flex gap-6 w-max"
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                repeat: Infinity,
                duration: 40,
                ease: "linear",
              }}
            >
              {loopedTestimonials.map((t, idx) => (
                <div
                  key={`${t.name}-${idx}`}
                  className="min-w-[280px] max-w-xs flex-shrink-0 bg-gray-100 rounded-2xl shadow-md border border-black/10 p-6 flex flex-col items-center text-center hover:shadow-lg transition"
                >
                  <div className="w-14 h-14 flex items-center justify-center rounded-full bg-black text-white text-2xl font-bold mb-4 shadow">
                    {t.name.charAt(0).toUpperCase()}
                  </div>
                  <p className="text-black/70 italic mb-4">“{t.quote}”</p>
                  <span className="font-semibold text-black">{t.name}</span>
                </div>
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}

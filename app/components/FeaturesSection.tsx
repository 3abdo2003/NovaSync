"use client";

import * as Icons from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type IconName = keyof typeof Icons;

type Feature = {
  title: string;
  description: string;
  icon: string; // we keep this as string because API might return invalid ones
};

export default function FeaturesSection() {
  const [features, setFeatures] = useState<Feature[]>([]);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const res = await fetch("/api/features");
        const data = await res.json();
        setFeatures(data);
      } catch (error) {
        console.error("Failed to load features:", error);
      }
    };

    fetchFeatures();
  }, []);

  const loopedFeatures = [...features, ...features];

  return (
    <section
      id="features"
      className="py-20 bg-white shadow-[0_-8px_24px_0_rgba(0,0,0,0.04)] -mt-4 relative z-10 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-black">
          Features
        </h2>

        <div className="relative w-full overflow-hidden">
          <motion.div
            className="flex gap-8 w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              duration: 20,
              ease: "linear",
            }}
          >
            {loopedFeatures.map((feature, idx) => {
              const Icon =
                Icons[feature.icon as IconName] ?? Icons["CalendarDaysIcon"];

              return (
                <div
                  key={`${feature.title}-${idx}`}
                  className="min-w-[300px] max-w-xs flex-shrink-0 bg-gray-100 p-6 rounded-2xl shadow-md border border-black/10 flex flex-col items-center text-center hover:shadow-lg transition"
                >
                  <Icon className="w-12 h-12 text-black mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-black">
                    {feature.title}
                  </h3>
                  <p className="text-black/70">{feature.description}</p>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

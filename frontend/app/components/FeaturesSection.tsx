"use client";

import { CalendarDaysIcon, SparklesIcon, DevicePhoneMobileIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const features = [
  {
    icon: CalendarDaysIcon,
    title: "Smart Scheduling",
    description: "Let AI find the best meeting times and avoid conflicts automatically.",
  },
  {
    icon: SparklesIcon,
    title: "Productivity Insights",
    description: "Get actionable analytics and suggestions to optimize your workflow.",
  },
  {
    icon: DevicePhoneMobileIcon,
    title: "Seamless Sync",
    description: "Sync your calendars and tasks across all your devices effortlessly.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white shadow-[0_-8px_24px_0_rgba(0,0,0,0.04)] -mt-4 relative z-10">
      <div className="max-w-5xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-black"
        >
          Features
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-10"
        >
          {features.map((feature, idx) => (
            <div
              key={feature.title}
              className="flex flex-col items-center text-center p-8 bg-gray-100 rounded-2xl shadow-md border border-black/10 hover:shadow-lg transition"
            >
              <feature.icon className="w-12 h-12 text-black mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-black">{feature.title}</h3>
              <p className="text-black/70">{feature.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 
"use client";
import { motion } from "framer-motion";

const steps = [
  {
    title: "Connect Your Calendars",
    description: "Easily link your Google, Outlook, or Apple calendars in seconds.",
  },
  {
    title: "Let AI Organize",
    description: "NovaSync analyzes your schedule and finds the best times for meetings and tasks.",
  },
  {
    title: "Boost Productivity",
    description: "Get reminders, insights, and suggestions to stay on top of your day.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-20 bg-white shadow-[0_-8px_24px_0_rgba(0,0,0,0.04)] -mt-4 relative z-10">
      <div className="max-w-4xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-black"
        >
          How It Works
        </motion.h2>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10"
        >
          {steps.map((step, idx) => (
            <motion.div
              key={step.title}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col items-center text-center sm:p-6 p-4 bg-gray-100 rounded-2xl shadow-md border border-black/10 hover:shadow-lg transition"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-black text-white text-2xl font-bold mb-4">
                {idx + 1}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-black">{step.title}</h3>
              <p className="text-black/70">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

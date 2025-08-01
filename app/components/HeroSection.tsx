"use client";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[60vh] py-24 text-center bg-white overflow-hidden shadow-md border-b border-black/10">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-radial from-black/5 to-transparent opacity-80" />
      </div>
      <div className="relative z-10 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h1 className="text-6xl md:text-7xl font-extrabold text-black mb-6 leading-tight tracking-tight drop-shadow-lg">
            NovaSync
          </h1>
          <p className="text-xl md:text-2xl text-black/70 mb-8 font-medium">
            Your AI-powered calendar and productivity assistant.
          </p>
          <p className="text-lg md:text-xl text-black/50 mb-10 font-normal">
            Stay organized, in sync, and ahead of your day.
          </p>
          <a
            href="#features"
            className="inline-flex items-center px-10 py-4 bg-black text-white font-bold rounded-full shadow-lg hover:bg-white hover:text-black border-2 border-black transition group transform hover:scale-105 focus:scale-105 focus:outline-none focus:ring-4 focus:ring-black/10"
          >
            Get Started
            <ArrowRightIcon className="w-6 h-6 ml-3 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </section>
  );
} 
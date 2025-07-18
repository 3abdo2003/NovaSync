import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { Linkedin, Github, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white text-black py-8 border-t border-black/10 shadow-[0_-2px_8px_0_rgba(0,0,0,0.04)]">
      <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="flex gap-6 mb-4 md:mb-0">
          <a href="#" className="hover:underline hover:font-bold transition-colors">Privacy Policy</a>
          <a href="#" className="hover:underline hover:font-bold transition-colors">Terms</a>
          <a href="#" className="hover:underline hover:font-bold transition-colors">Contact</a>
        </div>
        <div className="flex gap-5">
          <a href="#" aria-label="LinkedIn" className="hover:text-black font-bold transition-colors">
            <Linkedin className="w-6 h-6" />
          </a>
          <a href="#" aria-label="GitHub" className="hover:text-black font-bold transition-colors">
            <Github className="w-6 h-6" />
          </a>
          <a href="#" aria-label="Twitter" className="hover:text-black font-bold transition-colors">
            <Twitter className="w-6 h-6" />
          </a>
        </div>
      </div>
      <div className="text-center text-xs text-black/60 mt-6">&copy; {new Date().getFullYear()} NovaSync. All rights reserved.</div>
    </footer>
  );
} 
"use client";

import { Moon, Stethoscope } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Navigation() {
  return (
    <nav className="w-full flex items-center justify-between px-8 py-6 relative z-10 border-b border-white/[0.05] glassmorphism">
      <div className="flex items-center gap-12">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-to-br from-medical-blue to-medical-dark p-2 rounded-lg group-hover:shadow-[0_0_15px_rgba(14,165,233,0.5)] transition-all duration-300">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-semibold tracking-tight text-white flex gap-1">
            AI <span className="text-medical-blue font-light">Scheduler</span>
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <Link href="#" className="text-white transition-colors">Home</Link>
          <Link href="#" className="hover:text-white transition-colors">About</Link>
          <Link href="#" className="hover:text-white transition-colors">How it works</Link>
          <Link href="#" className="hover:text-white transition-colors">Resources</Link>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-white/[0.05] border border-transparent hover:border-white/[0.08] transition-all text-slate-300 hover:text-white group">
          <Moon className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>
        <div className="hidden md:block w-px h-6 bg-white/[0.1]"></div>
        <Link href="#" className="hidden md:block text-sm font-medium text-white hover:text-medical-blue transition-colors px-4 py-2">
          Login
        </Link>
        <button className="bg-medical-blue hover:bg-medical-accent text-white px-6 py-2.5 rounded-full font-medium text-sm transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_25px_rgba(14,165,233,0.5)] hover:-translate-y-0.5 active:translate-y-0">
          Request a Demo
        </button>
      </div>
    </nav>
  );
}

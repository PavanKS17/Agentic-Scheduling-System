"use client";

import { motion } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { ChatInterface } from "@/components/ChatInterface";
import { ArrowRight, PlayCircle } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen w-full relative flex flex-col items-center">
      <Navigation />

      <div className="flex-1 w-full max-w-[90rem] mx-auto px-6 sm:px-8 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 py-12 lg:py-0 relative z-10">
        
        {/* Left Side: Hero Information */}
        <motion.div 
          className="flex-1 text-left pt-8 lg:pt-0 max-w-2xl lg:ml-8"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8 glass-card">
            <span className="bg-medical-blue text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">New</span>
            <span className="text-xs text-slate-300">Omnichannel Text-to-Voice Handoff</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-[5rem] leading-[1.05] font-bold text-white mb-6 tracking-tight">
            Intelligent <br />
            Patient Intake & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-medical-light via-medical-blue to-medical-accent">AI Scheduling.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 mb-10 leading-relaxed font-light max-w-xl">
            Deploy healthcare-grade agents to automate patient onboarding, intelligently route symptoms to the right specialists, and offer seamless text-to-voice handoff—so your team can focus on care.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button className="w-full sm:w-auto bg-medical-blue hover:bg-medical-accent text-white px-8 py-3.5 rounded-full font-medium transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] flex items-center justify-center gap-2 group hover:-translate-y-0.5 active:translate-y-0 text-base">
              Request a demo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-8 py-3.5 rounded-full font-medium text-white bg-white/[0.03] border border-white/[0.1] hover:bg-white/[0.08] transition-all flex items-center justify-center gap-2 group text-base glassmorphism group-hover:-translate-y-0.5 active:translate-y-0">
              <PlayCircle className="w-5 h-5 group-hover:-rotate-12 transition-transform text-slate-300" />
              Watch product tour
            </button>
          </div>
        </motion.div>

        {/* Right Side: Chat / Dashboard Interface */}
        <motion.div 
          className="flex-1 w-full flex items-center justify-center pt-8 lg:pt-0 lg:mr-8"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="w-full relative shadow-[0_0_120px_rgba(14,165,233,0.1)] rounded-3xl">
            {/* Ambient subtle glow behind chat */}
            <div className="absolute inset-0 bg-gradient-to-tr from-medical-blue/20 to-medical-dark/40 blur-3xl opacity-50 rounded-[3rem] -z-10" />
            <ChatInterface />
          </div>
        </motion.div>

      </div>
    </main>
  );
}

"use client";

import { motion } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { ChatInterface } from "@/components/ChatInterface";
import { ArrowRight, PlayCircle } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen w-full relative flex flex-col items-center">
      <Navigation />

      <section id="home" className="flex-1 w-full max-w-[90rem] mx-auto px-6 sm:px-8 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 py-12 lg:min-h-[calc(100vh-100px)] relative z-10">
        
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
            <button 
              onClick={() => window.dispatchEvent(new Event("open-medical-call"))}
              className="w-full sm:w-auto bg-medical-blue hover:bg-medical-accent text-white px-8 py-3.5 rounded-full font-medium transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] flex items-center justify-center gap-2 group hover:-translate-y-0.5 active:translate-y-0 text-base"
            >
              Call Agent
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

      </section>

      {/* Features Section */}
      <section id="features" className="w-full max-w-[90rem] mx-auto px-6 sm:px-8 py-24 border-t border-white/[0.05]">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Designed for Modern Providers</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Kyron Medicals AI Scheduler goes beyond simple chatbots. It integrates into dynamic timelines, manages context synchronously, and supports a multitude of patient intentions.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Semantic Triage", desc: "Instantly route patients to the correct specialty without human intervention." },
              { title: "Physical Call Handoff", desc: "Allows continuous context transfer from web chat to physical phone calls via Vapi Outbound calling." },
              { title: "EHR Generation", desc: "Generates mock FHIR-compliant payloads mimicking existing hospital databases." }
            ].map((feature, i) => (
              <div key={i} className="glass-card p-8 rounded-3xl border border-white/[0.05] hover:border-medical-blue/30 transition-all hover:-translate-y-2 group cursor-default">
                 <div className="w-12 h-12 rounded-full bg-medical-blue/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   <div className="w-4 h-4 rounded-full bg-medical-blue shadow-[0_0_10px_rgba(14,165,233,0.8)]" />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                 <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="w-full bg-white/[0.01] py-24 border-t border-white/[0.05] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-b from-medical-blue/5 to-transparent blur-3xl -z-10" />
        <div className="max-w-[90rem] mx-auto px-6 sm:px-8 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white">Seamless Patient Experience</h2>
            <div className="space-y-6">
              {[
                 { step: "01", text: "Patient describes their symptoms naturally via web chat." },
                 { step: "02", text: "AI requests profile details and maps the symptoms to specialized practice." },
                 { step: "03", text: "Agent confirms booking, fires calendar invite, and pushes EHR payload." }
              ].map((s, i) => (
                 <div key={i} className="flex items-center gap-6 group hover:translate-x-2 transition-transform">
                   <div className="w-14 h-14 flex flex-shrink-0 items-center justify-center rounded-2xl bg-white/[0.03] text-medical-blue font-bold border border-white/[0.1] group-hover:bg-medical-blue/10 group-hover:border-medical-blue/30 transition-colors shadow-lg">{s.step}</div>
                   <p className="text-slate-300 font-medium text-lg">{s.text}</p>
                 </div>
              ))}
            </div>
          </div>
          <div className="flex-1 w-full bg-slate-900/50 p-4 sm:p-10 rounded-3xl border border-white/[0.08] shadow-2xl relative group overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-medical-blue/10 via-transparent to-medical-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
             <div className="aspect-video bg-black/40 rounded-xl border border-white/[0.05] flex items-center justify-center overflow-hidden relative group-hover:border-white/[0.15] transition-colors shadow-inner backdrop-blur-sm">
                <PlayCircle className="text-medical-blue/30 w-20 h-20 group-hover:scale-110 transition-all group-hover:text-medical-blue cursor-pointer drop-shadow-[0_0_15px_rgba(14,165,233,0.5)]" />
             </div>
          </div>
        </div>
      </section>
    </main>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Scheduler | Intelligent Patient Scheduling and Intake",
  description: "Deploy healthcare-grade agents to automate patient onboarding, intelligently route symptoms to the right specialists, and offer seamless text-to-voice handoff—so your team can focus on care.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.className} min-h-screen flex flex-col bg-grid text-slate-100 relative overflow-x-hidden bg-background`}>
        {/* Subtle radial gradients for the background glass lighting effect */}
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-medical-blue/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        {children}
      </body>
    </html>
  );
}

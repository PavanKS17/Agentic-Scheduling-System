"use client";

import { motion } from "framer-motion";
import { User, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "user" | "ai";
  content: string;
  isRecent?: boolean;
}

export function ChatMessage({ role, content, isRecent = false }: ChatMessageProps) {
  const isAi = role === "ai";

  return (
    <motion.div
      initial={isRecent ? { opacity: 0, y: 15, scale: 0.95 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className={cn(
        "flex w-full mt-4",
        isAi ? "justify-start" : "justify-end"
      )}
    >
      <div 
        className={cn(
          "flex max-w-[85%] sm:max-w-[75%] gap-3 px-4 py-3 shadow-lg relative",
          isAi 
            ? "glass-card text-slate-100 rounded-2xl rounded-tl-sm border-white/[0.05]" 
            : "bg-medical-blue text-white rounded-2xl rounded-tr-sm"
        )}
      >
        {isAi && (
          <div className="flex-shrink-0 mt-1">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
              <ShieldAlert className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
        )}
        
        <div className="text-sm leading-relaxed tracking-wide pt-0.5 whitespace-pre-wrap">
          {content}
        </div>
        
        {!isAi && (
          <div className="flex-shrink-0 mt-1">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

"use client";

import { useRef, useEffect, useState } from "react";
import { Send, Upload, PhoneCall, PhoneOff, Loader2 } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";
import { motion } from "framer-motion";
import { useChat } from "@ai-sdk/react";
import Vapi from "@vapi-ai/web";

export function ChatInterface() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "1",
        role: "ai" as const,
        content: "Hello! I am the AI Scheduler Booking Assistant. Which specialist do you need to see today, and what is your reason for visiting?",
      }
    ]
  } as any) as any;
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Vapi Voice Integration State
  const vapiRef = useRef<any>(null);
  const [callStatus, setCallStatus] = useState<"inactive" | "loading" | "active">("inactive");

  useEffect(() => {
    // Initialize Vapi immediately so it's ready. Hardcode a fallback key if env is missing to prevent crash.
    const pk = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || "vapi_dummy_key_123";
    const vapi = new Vapi(pk);
    vapiRef.current = vapi;

    vapi.on('call-start', () => setCallStatus('active'));
    vapi.on('call-end', () => setCallStatus('inactive'));
    vapi.on('error', (e) => {
      console.error("Vapi Error:", e);
      setCallStatus('inactive');
    });

    return () => {
      vapi.stop();
    };
  }, []);

  const handleStartCall = () => {
    if (!vapiRef.current) return;
    setCallStatus("loading");

    // Serialize chat history for context handoff
    const history = messages
      .filter((m: any) => m.role === 'user' || m.role === 'assistant')
      .map((m: any) => ({
        role: m.role,
        content: m.content || "[Tool Invoked]",
      }));

    const assistantConfig = {
      model: {
        provider: "openai",
        model: "gpt-3.5-turbo",
        systemPrompt: `You are the AI Scheduler Medical Assistant. Your primary role is to help patients book appointments.
        
CRITICAL RULES:
1. STRICTLY FORBIDDEN: You must NEVER provide medical advice, diagnoses, or treatment recommendations.
2. If the user hasn't provided Name, DOB, Phone, Email, and Reason, ask for them pleasantly.
3. Assume you are a conversational continuation of the web text chat.

Review the existing text chat history below to understand the current state of the conversation. DO NOT ask them for info they already provided in the web chat:
CHAT HISTORY:
${JSON.stringify(history, null, 2)}
`,
      },
      firstMessage: "Hi there! I'm switching over to voice from our text chat. How can I help you finish booking this appointment?",
      voice: {
        provider: "playht",
        voiceId: "s3://voice-cloning-zero-shot/d9ff78ba-d016-47f6-b0ef-dd630f59414e/female-cs/manifest.json" // Standard professional female AI voice
      },
    };

    vapiRef.current.start(assistantConfig);
  };


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="flex flex-col h-[70vh] md:h-[600px] w-full max-w-2xl mx-auto glassmorphism rounded-3xl overflow-hidden border border-white/[0.08] relative"
    >
      {/* Top Header */}
      <div className="px-6 py-4 glass-card border-b border-white/[0.05] rounded-none rounded-t-3xl flex justify-between items-center z-10 backdrop-blur-2xl">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.6)]" />
          <h2 className="text-white font-medium text-sm">Intake Agent (Gemini)</h2>
        </div>
        <div className="text-xs text-slate-400 px-3 py-1 bg-white/[0.03] rounded-full border border-white/[0.05]">
          Active
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 scroll-smooth scrollbar-thin scrollbar-thumb-white/[0.1] scrollbar-track-transparent">
        <div className="space-y-2 flex flex-col justify-end min-h-full">
          {messages.map((msg: any, i: number) => {
            // Filter out empty messages (often side effects of tool invocations)
            if (!msg.content && (!msg.toolInvocations || msg.toolInvocations.length === 0)) return null;
            
            // Hide pure tool invocations if they have no text payload and you don't want to show raw JSON bubbles
            if (!msg.content && msg.toolInvocations) return null;
            
            const mappedRole = msg.role === 'user' ? 'user' : 'ai';
            
            return (
              <ChatMessage 
                key={msg.id} 
                role={mappedRole} 
                content={msg.content || ""} 
                isRecent={i === messages.length - 1} 
              />
            );
          })}
          {isLoading && messages[messages.length - 1]?.role === 'user' && <TypingIndicator />}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 sm:p-6 bg-transparent border-t border-white/[0.05] z-10 w-full overflow-hidden">
        
        {/* If call is active/loading, display an active call plate */}
        {callStatus !== "inactive" && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-md z-20 flex flex-col items-center justify-center p-6 border-t border-medical-blue/30 shadow-[inset_0_20px_50px_rgba(14,165,233,0.1)] rounded-b-3xl">
            <div className="w-16 h-16 rounded-full bg-medical-blue/20 border-2 border-medical-blue flex items-center justify-center mb-4 relative">
              {callStatus === 'loading' ? (
                <Loader2 className="w-8 h-8 text-medical-blue animate-spin" />
              ) : (
                <>
                  <div className="absolute inset-0 bg-medical-blue rounded-full animate-ping opacity-30"></div>
                  <PhoneCall className="w-8 h-8 text-medical-blue relative z-10" />
                </>
              )}
            </div>
            <h3 className="text-white font-medium mb-1">
              {callStatus === 'loading' ? 'Connecting to Voice Agent...' : 'Agent Connected'}
            </h3>
            <p className="text-slate-400 text-xs mb-6">Seamless handoff active</p>
            
            <button 
              onClick={() => vapiRef.current?.stop()}
              className="bg-red-500/20 hover:bg-red-500/40 text-red-200 border border-red-500/50 px-8 py-3 rounded-full font-medium transition-colors flex items-center gap-2"
            >
              <PhoneOff className="w-4 h-4" />
              End Call
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative flex items-end w-full gap-2">
          
          <div className="relative flex items-end w-full group flex-1">
            <button type="button" className="absolute left-3 bottom-2.5 p-2 text-slate-400 hover:text-medical-blue transition-colors rounded-full hover:bg-white/[0.05]">
              <Upload className="w-5 h-5" />
            </button>
            
            <textarea
              value={input || ""}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  const form = e.currentTarget.form;
                  if (form) form.requestSubmit();
                }
              }}
              placeholder="Describe symptoms or ask to book..."
              className="w-full bg-white/[0.02] border border-white/[0.1] text-slate-200 text-sm rounded-2xl pl-12 pr-14 py-4 min-h-[56px] max-h-32 resize-none backdrop-blur-sm focus:outline-none focus:border-medical-blue/50 focus:ring-1 focus:ring-medical-blue/50 transition-all placeholder:text-slate-500 shadow-inner group-hover:border-white/[0.15]"
              rows={1}
            />
            
            <button 
              type="submit"
              disabled={!input || !input.trim() || isLoading}
              className="absolute right-3 bottom-2.5 p-2 bg-gradient-to-br from-medical-blue to-[#082f49] hover:from-medical-accent hover:to-medical-blue disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all rounded-full shadow-[0_4px_12px_rgba(14,165,233,0.3)] disabled:shadow-none"
            >
              <Send className="w-5 h-5 -ml-0.5 ml-0.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={callStatus === 'inactive' ? handleStartCall : () => vapiRef.current?.stop()}
            title="Call Me Instead"
            className="p-3 bg-white/[0.03] border border-white/[0.1] hover:bg-medical-blue/20 hover:border-medical-blue/50 transition-all rounded-2xl h-[56px] w-[56px] flex-shrink-0 flex items-center justify-center text-emerald-400 shadow-[0_4px_12px_rgba(0,0,0,0.2)] group"
          >
            <PhoneCall className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>
        </form>
        <p className="text-center text-[10px] text-slate-500 mt-4 tracking-wide relative z-10">
          AI assistants may produce inaccurate information. Always verify appointments with your provider.
        </p>
      </div>

    </motion.div>
  );
}


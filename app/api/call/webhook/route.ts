import { NextResponse } from 'next/server';
import { storeCallResult } from '@/lib/vapi-store';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("[VAPI WEBHOOK] Received event:", body.message?.type || "unknown");

    // Vapi sends 'call.ended' with an analysis object containing a summary.
    if (body.message?.type === "call-ended") {
      const callId = body.message.call?.id;
      const summary = body.message.analysis?.summary || "No summary provided by the assistant.";
      const transcript = body.message.transcript || "No transcript available.";

      if (callId) {
        console.log(`[VAPI WEBHOOK] Storing results for Call ID: ${callId}`);
        storeCallResult(callId, summary, transcript);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[VAPI WEBHOOK] Error processing webhook:", error);
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 });
  }
}

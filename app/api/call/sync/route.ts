import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const callId = searchParams.get("id");

  if (!callId) {
    return NextResponse.json({ error: "No call ID provided" }, { status: 400 });
  }

  try {
    // Fetch the specific call details directly from Vapi's servers
    const response = await fetch(`https://api.vapi.ai/call/${callId}`, {
      method: "GET",
      headers: {
        // This requires your PRIVATE key, not your Public key
        Authorization: `Bearer ${process.env.VAPI_PRIVATE_KEY}`, 
      },
    });

    const callData = await response.json();

    // If the call has officially ended, grab the summary
    if (callData.status === "ended") {
      // If the call was too short, Vapi might not generate a summary. We add a fallback.
      const summary = callData.summary || "The call was completed, but no detailed summary was generated (the call may have been too short).";
      
      return NextResponse.json({ status: "completed", summary });
    } else {
      // If the call is still ringing or active
      return NextResponse.json({ status: "pending" });
    }
  } catch (error) {
    console.error("Vapi Sync Error:", error);
    return NextResponse.json({ error: "Failed to fetch call data from Vapi" }, { status: 500 });
  }
}
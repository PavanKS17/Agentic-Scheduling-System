import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { phoneNumber, chatHistory } = await req.json();

    const PK = process.env.VAPI_PRIVATE_KEY;
    const phoneNumberId = process.env.VAPI_PHONE_NUMBER_ID;

    if (!PK || !phoneNumberId || !phoneNumber) {
      return NextResponse.json({ error: "Missing keys, Phone Number ID, or customer phone number" }, { status: 400 });
    }

    const assistantId = process.env.VAPI_ASSISTANT_ID;
    const payload = {
      phoneNumberId: phoneNumberId,
      customer: {
        number: phoneNumber,
      },
      assistantId: assistantId,
      assistantOverrides: {
        variableValues: {
          chatHistory: JSON.stringify(chatHistory, null, 2),
        },
        model: {
          provider: "google",
          model: "gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content: `You are a professional medical scheduling assistant. Your role is to help patients interact with the clinic over the phone.
        
CRITICAL RULES & SAFETY:
1. STRICTLY FORBIDDEN: You must NEVER provide medical advice, diagnoses, or treatment recommendations.
2. If the user hasn't provided their full intake details (Name, DOB, Phone, Email, Reason), ask them.
3. You are continuing this conversation from an active web chat. DO NOT ask them for information they have already provided to you in the web chat exactly as listed in the CHAT HISTORY below. Be polite and seamlessly pick up where they left off.

CHAT HISTORY (Web Context):
{{chatHistory}}
`
            }
          ]
        }
      }
    };

    console.log("[VAPI] Dialing Outbound Call using Assistant ID:", assistantId);
    console.log("[VAPI] Dialing Outbound Call to:", phoneNumber);
    
    const vapiResponse = await fetch('https://api.vapi.ai/call/phone', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PK}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await vapiResponse.json();
    console.log("[VAPI] Response Status:", vapiResponse.status);

    if (!vapiResponse.ok) {
      console.error("[VAPI] Error Response:", data);
      return NextResponse.json({ error: "Vapi call failed", details: data }, { status: vapiResponse.status });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Call initiated", 
      callId: data.id // Return the Vapi callId so the frontend can sync it later
    });
  } catch (error: any) {
    console.error("Vapi Outbound Backend Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

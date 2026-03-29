// Simple in-memory storage for call results (for development/demo purposes)
// In production, you would use a database like Postgres, Redis, or an EHR API.

const globalForVapi = globalThis as unknown as {
  vapiStore: Map<string, { summary: string; transcript: string; status: string }>;
};

export const vapiStore = globalForVapi.vapiStore || new Map<string, { summary: string; transcript: string; status: string }>();

if (process.env.NODE_ENV !== "production") globalForVapi.vapiStore = vapiStore;

export const storeCallResult = (callId: string, summary: string, transcript: string) => {
  console.log(`[VAPI STORE] Storing result for ${callId}`);
  vapiStore.set(callId, { summary, transcript, status: "completed" });
};

export const getCallResult = (callId: string) => {
  return vapiStore.get(callId);
};

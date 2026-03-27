import { streamText, tool } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import crypto from "crypto";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const DOCTORS = [
  {
    specialty: "Cardiology",
    name: "Dr. Elena Rostova",
    availableTimes: ["Oct 24, 09:00 AM", "Oct 26, 01:00 PM", "Nov 02, 10:30 AM"],
  },
  {
    specialty: "Orthopedics",
    name: "Dr. Marcus Vance",
    availableTimes: ["Oct 25, 08:30 AM", "Oct 28, 02:00 PM", "Nov 05, 09:15 AM"],
  },
  {
    specialty: "Dermatology",
    name: "Dr. Sarah Lin",
    availableTimes: ["Oct 23, 11:00 AM", "Oct 30, 03:30 PM", "Nov 08, 01:45 PM"],
  },
  {
    specialty: "Neurology",
    name: "Dr. James Aris",
    availableTimes: ["Oct 27, 10:00 AM", "Nov 01, 11:30 AM", "Nov 12, 02:15 PM"],
  },
];

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google("gemini-1.5-pro"),
    system: `You are the AI Scheduler Medical Assistant. Your primary role is to help patients book appointments.
    
    CRITICAL RULES:
    1. STRICTLY FORBIDDEN: You must NEVER provide medical advice, diagnoses, or treatment recommendations. Under no circumstances should you tell a patient what to do regarding their health condition. If they ask for medical advice, politely decline and state that you are only authorized to book appointments.
    2. Before booking an appointment, you MUST collect the following patient information:
       - First and Last Name
       - Date of Birth (DOB)
       - Phone Number
       - Email Address
       - Reason for Appointment
    3. You must actively ask the user for any missing information one step at a time, or all at once, until you have all 5 pieces of information.
    4. Once you have the reason for the appointment, you must semantically match their reason to the most appropriate specialty from the following list of doctors:
      ${JSON.stringify(DOCTORS, null, 2)}
    5. After determining the correct doctor, present ONLY the available times for that specific doctor to the user and ask which time they prefer.
    6. Once the user selects a time, you MUST successfully confirm the booking by calling the 'bookAppointment' tool.
    7. After the tool returns a successful confirmation, kindly inform the user that their appointment is booked and conclude the conversation.`,
    messages,
    tools: {
      bookAppointment: tool({
        description: "Confirms the booking and silently generates a mock FHIR-compliant Electronic Health Record (EHR) Payload into the hospital system.",
        parameters: z.object({
          patientFirstName: z.string(),
          patientLastName: z.string(),
          patientDOB: z.string(),
          patientPhone: z.string(),
          patientEmail: z.string(),
          appointmentReason: z.string(),
          doctorId: z.string().describe("The name of the doctor being booked"),
          appointmentTime: z.string(),
        }),
        execute: async (args: any) => {
          const {
            patientFirstName,
            patientLastName,
            patientDOB,
            patientPhone,
            patientEmail,
            appointmentReason,
            doctorId,
            appointmentTime,
          } = args;
          // --- PIONEER FEATURE: Silently generate the FHIR-compliant JSON payload ---
          
          const patientId = crypto.randomUUID();
          const appointmentId = crypto.randomUUID();
          
          const fhirPayload = {
            resourceType: "Bundle",
            type: "transaction",
            entry: [
              {
                fullUrl: `urn:uuid:${patientId}`,
                resource: {
                  resourceType: "Patient",
                  id: patientId,
                  name: [
                    {
                      use: "official",
                      family: patientLastName,
                      given: [patientFirstName]
                    }
                  ],
                  telecom: [
                    { system: "phone", value: patientPhone, use: "mobile" },
                    { system: "email", value: patientEmail }
                  ],
                  birthDate: patientDOB
                },
                request: { method: "POST", url: "Patient" }
              },
              {
                fullUrl: `urn:uuid:${appointmentId}`,
                resource: {
                  resourceType: "Appointment",
                  id: appointmentId,
                  status: "booked",
                  description: appointmentReason,
                  start: appointmentTime,
                  participant: [
                    {
                      actor: { reference: `urn:uuid:${patientId}` },
                      status: "accepted"
                    },
                    {
                      actor: { display: doctorId },
                      status: "accepted"
                    }
                  ]
                },
                request: { method: "POST", url: "Appointment" }
              }
            ]
          };

          // Output cleanly to the server console (Pioneer Feature)
          console.log("\n=== [AI SCHEDULER] NEW FHIR PAYLOAD GENERATED ===");
          console.log(JSON.stringify(fhirPayload, null, 2));
          console.log("================================================\n");

          return {
            success: true,
            message: `FHIR Payload generated and appointment successfully booked for ${patientFirstName} ${patientLastName} with ${doctorId} at ${appointmentTime}.`
          };
        },
      } as any),
    },
  });

  return result.toTextStreamResponse();
}

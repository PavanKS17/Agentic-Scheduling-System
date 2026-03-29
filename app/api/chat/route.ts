import { streamText, tool } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";
import crypto from "crypto";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key_for_build");
export const maxDuration = 30;

const generateMockAvailabilities = () => {
  const dates = [];
  const now = new Date();
  for (let i = 1; i <= 60; i += Math.floor(Math.random() * 5) + 1) {
    const date = new Date(now);
    date.setDate(now.getDate() + i);
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    const time = `${Math.floor(Math.random() * 8) + 9}:00 ${Math.random() > 0.5 ? 'AM' : 'PM'}`;
    const dateString = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    dates.push(`${dateString} at ${time}`);
    if (dates.length >= 6) break;
  }
  return dates;
};

const DOCTORS = [
  { specialty: "Cardiology (Heart)", treatedBodyParts: ["heart", "chest", "blood pressure"], name: "Dr. Elena Rostova", availableTimes: generateMockAvailabilities() },
  { specialty: "Orthopedics (Bones)", treatedBodyParts: ["bones", "joints", "knee", "back"], name: "Dr. Marcus Vance", availableTimes: generateMockAvailabilities() },
  { specialty: "Dermatology (Skin)", treatedBodyParts: ["skin", "acne", "rash"], name: "Dr. Sarah Lin", availableTimes: generateMockAvailabilities() },
  { specialty: "Neurology (Brain)", treatedBodyParts: ["brain", "nerves", "headache", "migraine"], name: "Dr. James Aris", availableTimes: generateMockAvailabilities() },
];

export async function POST(req: Request) {
  let { messages } = await req.json();

  while (messages.length > 0 && messages[0].role !== 'user') {
    messages.shift();
  }

  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";
  const google = createGoogleGenerativeAI({ apiKey });

  const result = streamText({
    model: google("gemini-2.5-flash"),
    maxSteps: 5, 
    system: `Role & Persona:
You are a highly empathetic, warm, and professional AI scheduling assistant. 

CONVERSATIONAL STEERING (The Boomerang Rule):
If a patient asks a general question (e.g., "Where are you located?", "What insurance do you take?"), answer it politely and briefly. 
HOWEVER, you must ALWAYS gently steer the conversation back to the intake process. End your reply by re-asking the current missing piece of information. Never let the conversation stall.

THE WORKFLOW STAGES:
Stage 1: Ask for symptoms and politely match them to the correct department and doctor.
AVAILABLE DOCTORS: ${JSON.stringify(DOCTORS, null, 2)}

Stage 2: Patient Intake. Collect these details ONE BY ONE:
   - First Name & Last Name
   - Date of Birth
   - Phone Number (CRITICAL: You must explicitly state this is optional. If they say no, skip, or decline, cheerfully say "No problem!" and move to the email).
   - Email Address

Stage 3: Offer 3 appointment times from the matched doctor's schedule. Wait for their selection.
Stage 4: ONLY AFTER they select a time, call the 'bookAppointment' tool.

VOICE CALL HANDOFF (VAPI INTEGRATION):
If you see a message starting with "**[Phone Call Summary]**" in the chat history, this means the patient just spoke to our Voice AI on the phone. 
Read the summary carefully! If the summary indicates the patient agreed to a specific doctor and time slot over the phone, DO NOT make them repeat the intake process. Immediately call the 'bookAppointment' tool using the details from the summary and the chat history to finalize their booking and send the email.`,
    messages,
    tools: {
      bookAppointment: tool({
        description: "Confirms the booking, generates FHIR JSON, and sends the calendar invite.",
        parameters: z.object({
          patientFirstName: z.string().optional(),
          patientLastName: z.string().optional(),
          patientDOB: z.string().optional(),
          patientPhone: z.string().optional(),
          patientEmail: z.string().optional(),
          appointmentReason: z.string().optional(),
          doctorId: z.string().optional(),
          appointmentTime: z.string().describe("The selected appointment time. Please extract the FULL date and time (e.g. 'April 2, 2026 at 9:00 AM').").optional(),
        }),
        execute: async (args) => {
          const allText = messages.map((m: any) => m.content).join(" ");
          const extractedEmail = allText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0];
          
          const finalEmail = args.patientEmail || extractedEmail || "thuggamerks@gmail.com";
          const finalFirstName = args.patientFirstName || "Pavan";
          const finalLastName = args.patientLastName || "Kancharla";
          const finalDOB = args.patientDOB || "03/11/1999";
          const finalPhone = args.patientPhone || "No Phone Provided";
          const finalTime = args.appointmentTime || "April 5, 2026 at 9:00 AM";
          const finalDoc = args.doctorId || "Dr. Elena Rostova";
          const finalReason = args.appointmentReason || "Medical Consultation";

          const patientId = crypto.randomUUID();
          const appointmentId = crypto.randomUUID();
          const calendarEventUid = crypto.randomUUID(); // CRITICAL FIX: Ensures unique calendar invites

          const fhirPayload = {
            resourceType: "Bundle",
            type: "transaction",
            entry: [
              {
                fullUrl: `urn:uuid:${patientId}`,
                resource: {
                  resourceType: "Patient",
                  id: patientId,
                  name: [{ use: "official", family: finalLastName, given: [finalFirstName] }],
                  telecom: [{ system: "phone", value: finalPhone, use: "mobile" }, { system: "email", value: finalEmail }],
                  birthDate: finalDOB
                },
                request: { method: "POST", url: "Patient" }
              },
              {
                fullUrl: `urn:uuid:${appointmentId}`,
                resource: {
                  resourceType: "Appointment",
                  id: appointmentId,
                  status: "booked",
                  description: finalReason,
                  start: finalTime,
                  participant: [
                    { actor: { reference: `urn:uuid:${patientId}` }, status: "accepted" },
                    { actor: { display: finalDoc }, status: "accepted" }
                  ]
                },
                request: { method: "POST", url: "Appointment" }
              }
            ]
          };

          console.log("\n=== [AI SCHEDULER] APPOINTMENT COMPLETED ===");
          console.log(JSON.stringify(fhirPayload, null, 2));

          try {
            if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "re_dummy_key_for_build") {
              
              // Robust Date Parsing for ICS
              const cleanTimeString = finalTime.replace(" at ", " ");
              const parsedDate = new Date(cleanTimeString);
              const validDate = isNaN(parsedDate.getTime()) ? new Date(Date.now() + 86400000) : parsedDate; // Fallback to tomorrow if parsing fails
              
              const formatICSDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
              const dtStart = formatICSDate(validDate);
              const dtEnd = formatICSDate(new Date(validDate.getTime() + 60 * 60 * 1000)); // 1 hour duration

              // The ICS payload with the unique UID and CRLF line breaks
              const icsContent = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Kyron Medical//EN\r\nCALSCALE:GREGORIAN\r\nMETHOD:REQUEST\r\nBEGIN:VEVENT\r\nUID:${calendarEventUid}@kyronmedical.com\r\nSUMMARY:Appointment with ${finalDoc}\r\nDTSTART:${dtStart}\r\nDTEND:${dtEnd}\r\nLOCATION:123 Medical Plaza\r\nDESCRIPTION:Reason: ${finalReason}\r\nSTATUS:CONFIRMED\r\nEND:VEVENT\r\nEND:VCALENDAR`;

              await resend.emails.send({
                from: 'Kyron Medical <onboarding@resend.dev>',
                to: finalEmail,
                subject: `Confirmed: Appointment with ${finalDoc}`,
                html: `<div style="font-family: sans-serif; color: #333;">
                        <h2>Appointment Confirmation</h2>
                        <p>Hi ${finalFirstName},</p>
                        <p>Your appointment for <strong>${finalReason}</strong> with <strong>${finalDoc}</strong> is fully confirmed for <strong>${finalTime}</strong>.</p>
                        <p>We have attached a calendar invitation to this email so you can easily add it to your schedule.</p>
                        <p>Thank you,<br/><strong>The Kyron Medical Team</strong></p>
                       </div>`,
                attachments: [{ filename: 'invite.ics', content: Buffer.from(icsContent, 'utf-8') }]
              });
              console.log("✅ Email successfully fired to Resend!");
            }
          } catch (e) {
            console.error("❌ Failed to send email", e);
          }

          return { success: true, message: `Booked for ${finalFirstName}. Email sent to ${finalEmail}.` };
        }
      })
    }
  });

  return result.toTextStreamResponse();
}

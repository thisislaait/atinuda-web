import { FieldValue, adminDb } from "@/utils/firebaseAdmin";
import { NextResponse } from "next/server";

const REQUIRED_STRING_FIELDS = [
  "q1_fullName",
  "q2_email",
  "q4_role",
  "q6_overall_rating",
  "q12_recommend",
  "q49_future_updates",
  "q51_permission",
] as const;

const ALLOWED_ROLES = new Set(["Attendee", "Speaker", "Partner / Sponsor", "Media", "Other"]);

type JsonValue = string | string[];

type RequestBody = {
  answers?: Record<string, JsonValue>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeString(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim();
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function pickNumber(value: JsonValue | undefined): number | null {
  if (typeof value !== "string") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function POST(req: Request) {
  let body: RequestBody;

  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON request body." }, { status: 400 });
  }

  if (!isRecord(body) || !isRecord(body.answers)) {
    return NextResponse.json({ ok: false, message: "Invalid request shape." }, { status: 400 });
  }

  const answers = body.answers as Record<string, JsonValue>;

  for (const field of REQUIRED_STRING_FIELDS) {
    const value = normalizeString(answers[field]);
    if (!value) {
      return NextResponse.json({ ok: false, message: `Missing required field: ${field}` }, { status: 400 });
    }
  }

  const email = normalizeString(answers.q2_email);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, message: "Please provide a valid email address." }, { status: 400 });
  }

  const role = normalizeString(answers.q4_role);
  if (!ALLOWED_ROLES.has(role)) {
    return NextResponse.json({ ok: false, message: "Invalid role selected." }, { status: 400 });
  }

  const q6 = pickNumber(answers.q6_overall_rating);
  const q12 = pickNumber(answers.q12_recommend);

  if (q6 === null || q6 < 1 || q6 > 10) {
    return NextResponse.json({ ok: false, message: "Question 6 rating must be between 1 and 10." }, { status: 400 });
  }

  if (q12 === null || q12 < 0 || q12 > 10) {
    return NextResponse.json({ ok: false, message: "Question 12 rating must be between 0 and 10." }, { status: 400 });
  }

  const normalizedAnswers: Record<string, JsonValue> = {};
  for (const [key, value] of Object.entries(answers)) {
    if (typeof value === "string") {
      const cleaned = value.trim();
      if (cleaned) normalizedAnswers[key] = cleaned;
      continue;
    }

    const cleanedArray = normalizeStringArray(value);
    if (cleanedArray.length > 0) {
      normalizedAnswers[key] = cleanedArray;
    }
  }

  try {
    const ref = await adminDb.collection("elevationRetreatFeedback").add({
      formTitle: normalizeString(answers.form_title) || "Elevation Retreat Reflection & Feedback",
      role,
      email,
      fullName: normalizeString(answers.q1_fullName),
      answers: normalizedAnswers,
      meta: {
        userAgent: normalizeString(req.headers.get("user-agent")),
        forwardedFor: normalizeString(req.headers.get("x-forwarded-for")),
      },
      submittedAt: FieldValue.serverTimestamp(),
      submittedAtIso: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true, id: ref.id }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save feedback.";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}

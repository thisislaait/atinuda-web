// src/app/spark-the-future-apply/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stepper } from "@/components/spark/stepper";
import { StepShell } from "@/components/spark/stepShell";
import { TextField, TextArea, SelectField, CheckboxField } from "@/components/spark/fields";
import { UploadField } from "@/components/spark/uploadField";

// --- schema (same as we aligned earlier) ---
const UploadZ = z.object({
  slideDeckUrl: z.string().url().optional(),
  slideDeckName: z.string().optional(),
  slideDeckSize: z.number().optional(),
});

const EligibilityZ = z.object({
  sectorFit: z.boolean().refine(v => v === true, "Required"),
  incorporationBySept2024: z.boolean().refine(v => v === true, "Required"),
  recurringRevenue12m: z.boolean().refine(v => v === true, "Required"),
  techAndSustainability: z.boolean().refine(v => v === true, "Required"),
  independentOwnership: z.boolean().refine(v => v === true, "Required"),
  willingToPartnerWithNord: z.boolean().refine(v => v === true, "Required"),
});

const FormZ = z.object({
  acceptTerms: z.boolean().refine(v => v === true, "You must accept the terms"),
  eligibility: EligibilityZ,

  applicantName: z.string().min(2),
  applicantEmail: z.string().email(),
  applicantPhone: z.string().min(6),

  companyName: z.string().min(2),
  registeredAddress: z.string().min(2),
  oneLiner: z.string().max(150),
  sector: z.enum(["production","venues","logistics","virtual_hybrid","hospitality","other"]),
  incorporationDate: z.string().min(4),

  website: z.string().url().optional().or(z.literal("")),
  socialLinks: z.array(z.string()).default([]),
  problemSolution: z.string().max(500),
  vision5y: z.string().min(2),
  sdgs: z.array(z.string()).max(3).default([]),
  impactMetrics: z.array(
    z.object({ name: z.string(), baseline: z.number(), current: z.number(), unit: z.string() })
  ).max(3).default([]),
  businessModel: z.string().min(2),
  revenueStreams: z.array(z.object({ name: z.string(), pricing: z.string() })).max(3).default([]),

  last12moRevenueBracket: z.enum(["0-10k","10k-50k","50k-200k","200k-1m","1m+"]),
  femaleFounder: z.boolean().optional(),
  team: z.string().min(2),
  advisors: z.string().optional().or(z.literal("")).default(""),

  willingToPartnerWithNord: z.boolean().refine(v => v === true, "Required"),
  uploads: UploadZ.default({}),
});
type FormT = z.infer<typeof FormZ>;

const steps = [
  { key: "terms", label: "Terms & Eligibility" },
  { key: "company", label: "Company Details" },
  { key: "solution", label: "Solution Details" },
  { key: "readiness", label: "Incorporation / Financials" },
];

const defaultValues: FormT = {
  acceptTerms: false,
  eligibility: {
    sectorFit: false,
    incorporationBySept2024: false,
    recurringRevenue12m: false,
    techAndSustainability: false,
    independentOwnership: false,
    willingToPartnerWithNord: false,
  },
  applicantName: "",
  applicantEmail: "",
  applicantPhone: "",
  companyName: "",
  registeredAddress: "",
  oneLiner: "",
  sector: "production",
  incorporationDate: "",
  website: "",
  socialLinks: [],
  problemSolution: "",
  vision5y: "",
  sdgs: [],
  impactMetrics: [],
  businessModel: "",
  revenueStreams: [],
  last12moRevenueBracket: "0-10k",
  team: "",
  advisors: "",
  willingToPartnerWithNord: false,
  uploads: {},
};

export default function SparkTheFutureApplyPage() {
  // ✅ hook is inside the component
  const methods = useForm<FormT>({
    resolver: zodResolver(FormZ),
    mode: "onChange",
    defaultValues:
      typeof window === "undefined"
        ? defaultValues
        : { ...defaultValues, ...(JSON.parse(localStorage.getItem("spark2025.draft") || "null") || {}) },
  });

  const { register, handleSubmit, watch, setValue, formState: { errors } } = methods;
  const [idx, setIdx] = useState(0);
  const [submitted, setSubmitted] = useState<{ id: string; createdAt?: number } | null>(null);
  const allValues = watch();

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("spark2025.draft", JSON.stringify(allValues));
    }
  }, [allValues]);

  const canNext = useMemo(() => {
    if (idx === 0) {
      const a = allValues?.acceptTerms;
      const e = (allValues?.eligibility || {}) as any;
      return !!a && Object.values(e).every(Boolean);
    }
    if (idx === 1) {
      return !!(
        allValues?.applicantName &&
        allValues?.applicantEmail &&
        allValues?.companyName &&
        allValues?.oneLiner &&
        allValues?.sector &&
        allValues?.incorporationDate
      );
    }
    if (idx === 2) {
      return !!(allValues?.problemSolution && allValues?.businessModel && allValues?.vision5y);
    }
    if (idx === 3) {
      const u: any = allValues?.uploads || {};
      return !!(allValues?.last12moRevenueBracket && allValues?.willingToPartnerWithNord && u?.slideDeckUrl);
    }
    return false;
  }, [idx, allValues]);

  function next() { setIdx(i => Math.min(i + 1, steps.length - 1)); }
  function prev() { setIdx(i => Math.max(i - 1, 0)); }

  // text → arrays helpers
  const splitComma = (v: string) => v.split(",").map(s => s.trim()).filter(Boolean);
  const parseRevenueStreams = (v: string) =>
    v.split(";").map(s => s.trim()).filter(Boolean).slice(0, 3)
      .map(pair => { const [name, pricing] = pair.split(":").map(t => t.trim()); return { name, pricing }; });
  const parseImpactMetrics = (v: string) =>
    v.split(";").map(s => s.trim()).filter(Boolean).slice(0, 3)
      .map(item => { const [name, b, c, unit] = item.split(":").map(t => t.trim());
        return { name, baseline: Number(b||0), current: Number(c||0), unit: unit || "" }; });

  async function onSubmit(finalData: FormT) {
    const payload: any = { ...finalData };
    if (typeof (finalData as any).socialLinks === "string") payload.socialLinks = splitComma((finalData as any).socialLinks);
    if (typeof (finalData as any).sdgs === "string") payload.sdgs = splitComma((finalData as any).sdgs).slice(0, 3);
    if (typeof (finalData as any).revenueStreams === "string") payload.revenueStreams = parseRevenueStreams((finalData as any).revenueStreams);
    if (typeof (finalData as any).impactMetrics === "string") payload.impactMetrics = parseImpactMetrics((finalData as any).impactMetrics);

    const res = await fetch("/api/spark-the-future/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) { const err = await res.json(); alert(err.error || "Submission failed"); return; }
    const out = await res.json();
    localStorage.removeItem("spark2025.draft");
    setSubmitted(out);
  }

  if (submitted) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16">
        <div className="rounded-2xl border p-6 text-center">
          <h1 className="text-2xl font-semibold">Application submitted 🎉</h1>
          <p className="mt-2 text-slate-700">Your reference ID:</p>
          <p className="mt-1 font-mono text-lg">{submitted.id}</p>
          <p className="mt-6 text-slate-700">We sent your details to the team. You can close this tab.</p>
          <a
            href="/spark-the-future"
            className="mt-6 inline-flex rounded-2xl border border-slate-900 px-4 py-2 font-medium transition hover:bg-slate-900 hover:text-white"
          >
            Back to programme page
          </a>
        </div>
      </main>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold">Spark the Future — Application</h1>
        <p className="mt-1 text-slate-600">4 steps • save-as-you-go • PDF deck required</p>

        <div className="mt-6">
          <Stepper steps={steps} currentIndex={idx} onClick={(i) => setIdx(i)} />
        </div>

        {idx === 0 && (
          <StepShell
            title="Step 1 — Terms & Eligibility"
            helper="Confirm you meet the baseline requirements and accept the terms."
            canNext={canNext}
            onPrev={prev}
            onNext={next}
          >
            <div className="space-y-6">
              <CheckboxField
                label="I accept the terms, privacy, and data use statements."
                reg={register("acceptTerms")}
                error={errors.acceptTerms && "Required"}
              />
              <div className="grid gap-4 md:grid-cols-2">
                <CheckboxField label="We operate in the events ecosystem" reg={register("eligibility.sectorFit")} />
                <CheckboxField label="Incorporated by Sept 2024" reg={register("eligibility.incorporationBySept2024")} />
                <CheckboxField label="12+ months recurring revenue" reg={register("eligibility.recurringRevenue12m")} />
                <CheckboxField label="Tech + sustainability integrated" reg={register("eligibility.techAndSustainability")} />
                <CheckboxField label="Independent ownership" reg={register("eligibility.independentOwnership")} />
                <CheckboxField label="Willing to partner with Nord" reg={register("eligibility.willingToPartnerWithNord")} />
              </div>
            </div>
          </StepShell>
        )}

        {idx === 1 && (
          <StepShell
            title="Step 2 — Company Details"
            helper="Tell us who you are and what you do."
            canNext={canNext}
            onPrev={prev}
            onNext={next}
          >
            <div className="grid gap-5">
              <div className="grid gap-5 md:grid-cols-2">
                <TextField label="Applicant name" reg={register("applicantName")} error={errors.applicantName?.message as any} />
                <TextField label="Applicant email" type="email" reg={register("applicantEmail")} error={errors.applicantEmail?.message as any} />
              </div>
              <TextField label="Phone" reg={register("applicantPhone")} error={errors.applicantPhone?.message as any} />
              <TextField label="Company name" reg={register("companyName")} error={errors.companyName?.message as any} />
              <TextField label="Registered address" reg={register("registeredAddress")} error={errors.registeredAddress?.message as any} />
              <TextField label="One-liner" hint="≤150 chars" reg={register("oneLiner")} error={errors.oneLiner?.message as any} />
              <div className="grid gap-5 md:grid-cols-2">
                <SelectField label="Sector" reg={register("sector")} error={errors.sector?.message as any}>
                  <option value="">Select</option>
                  <option value="production">Production</option>
                  <option value="venues">Venues</option>
                  <option value="logistics">Logistics</option>
                  <option value="virtual_hybrid">Virtual/Hybrid</option>
                  <option value="hospitality">Hospitality</option>
                  <option value="other">Other</option>
                </SelectField>
                <TextField label="Incorporation date" hint="YYYY-MM-DD" reg={register("incorporationDate")} error={errors.incorporationDate?.message as any} />
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <TextField label="Website" reg={register("website")} error={errors.website?.message as any} />
                <TextField label="Social links (comma-separated)" reg={register("socialLinks" as any)} hint="https://…,https://…" />
              </div>
            </div>
          </StepShell>
        )}

        {idx === 2 && (
          <StepShell
            title="Step 3 — Solution Details"
            helper="What do you solve and how do you scale impact?"
            canNext={canNext}
            onPrev={prev}
            onNext={next}
          >
            <div className="grid gap-5">
              <TextArea label="Problem & Solution" hint="≤500 chars" rows={5} reg={register("problemSolution")} error={errors.problemSolution?.message as any} />
              <TextArea label="5-year vision" rows={4} reg={register("vision5y")} error={errors.vision5y?.message as any} />
              <TextField label="Business model (short)" reg={register("businessModel")} error={errors.businessModel?.message as any} />
              <TextField label="Revenue streams (name:pricing; up to 3, semicolon-separated)" reg={register("revenueStreams" as any)} />
              <TextField label="SDGs (comma up to 3)" reg={register("sdgs" as any)} />
              <TextField label="Impact metrics (name:baseline:current:unit — up to 3; semicolons)" reg={register("impactMetrics" as any)} />
            </div>
          </StepShell>
        )}

        {idx === 3 && (
          <StepShell
            title="Step 4 — Incorporation / Financials / Pitch Readiness"
            helper="Revenue bracket, team, confirmations, and your PDF deck."
            canNext={canNext}
            onPrev={prev}
            onNext={handleSubmit(onSubmit)}
            isLast
          >
            <div className="grid gap-5">
              <SelectField label="Last 12 months revenue" reg={register("last12moRevenueBracket")} error={errors.last12moRevenueBracket?.message as any}>
                <option value="">Select</option>
                <option value="0-10k">$0–10k</option>
                <option value="10k-50k">$10k–50k</option>
                <option value="50k-200k">$50k–200k</option>
                <option value="200k-1m">$200k–$1m</option>
                <option value="1m+">$1m+</option>
              </SelectField>
              <div className="grid gap-5 md:grid-cols-2">
                <CheckboxField label="Female founder / cofounder" reg={register("femaleFounder")} />
                <CheckboxField label="Willing to partner with Nord" reg={register("willingToPartnerWithNord")} />
              </div>
              <TextArea label="Team (who does what)" rows={4} reg={register("team")} error={errors.team?.message as any} />
              <TextArea label="Advisors (optional)" rows={3} reg={register("advisors")} />
              <UploadField
                value={allValues.uploads?.slideDeckUrl ? {
                  url: allValues.uploads.slideDeckUrl as any,
                  name: allValues.uploads.slideDeckName as any,
                  size: allValues.uploads.slideDeckSize as any,
                } : null}
                onChange={(v) => setValue("uploads", {
                  slideDeckUrl: v?.url || "",
                  slideDeckName: v?.name || "",
                  slideDeckSize: v?.size || 0,
                }, { shouldDirty: true, shouldValidate: true })}
                docHint="Attach a single PDF (your 10-page deck)."
              />
              {!allValues.uploads?.slideDeckUrl && (
                <p className="text-xs text-red-600">PDF deck is required before submit.</p>
              )}
            </div>
          </StepShell>
        )}
      </form>
    </FormProvider>
  );
}

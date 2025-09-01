"use client";

import { useEffect, useRef, useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { ActionState } from "@/app/azizi-rsvp/action";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-[#ff7f41] px-4 py-3 text-sm font-extrabold uppercase tracking-wider text-white shadow-lg disabled:opacity-60"
    >
      {pending ? "Submitting..." : label}
    </button>
  );
}

export default function RsvpForm({
  action,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const initialState: ActionState = { ok: false, message: "" };
  const [state, formAction] = useActionState(action, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="ticketNumber" className="text-xs">
            Ticket number <span className="text-red-500">*</span>
          </label>
          <input
            id="ticketNumber"
            name="ticketNumber"
            placeholder="Enter your ticket number"
            required
            inputMode="numeric"
            className="mt-1 w-full rounded-xl border border-black/20 px-3 py-2 outline-none focus:ring-2 focus:ring-[#ff7f41]"
          />
        </div>
        <div>
          <label htmlFor="mobile" className="text-xs">
            Mobile <span className="text-red-500">*</span>
          </label>
          <input
            id="mobile"
            name="mobile"
            placeholder="e.g. +234 801 234 5678"
            required
            type="tel"
            autoComplete="tel"
            className="mt-1 w-full rounded-xl border border-black/20 px-3 py-2 outline-none focus:ring-2 focus:ring-[#ff7f41]"
          />
        </div>
      </div>

      <fieldset className="mt-2">
        <legend className="mb-2 text-xs">Are you attending?</legend>
        <div className="flex flex-wrap gap-3">
          {(["yes", "no", "maybe"] as const).map((val) => (
            <label
              key={val}
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-black/20 bg-black/5 px-3 py-2"
            >
              <input
                type="radio"
                name="rsvp"
                value={val}
                defaultChecked={val === "no"}
                className="h-4 w-4 accent-[#ff7f41]"
              />
              <span className="text-sm font-semibold uppercase tracking-wide">{val}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <SubmitButton label="Submit RSVP" />

      {state.message && (
        <div
          className={`rounded-xl border px-3 py-2 text-sm ${
            state.ok
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {state.message}
        </div>
      )}

      <p className="text-center text-xs">This event is free, but RSVP is required.</p>
    </form>
  );
}

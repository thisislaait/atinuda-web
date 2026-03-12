"use client";

import { ChangeEventHandler, FormEvent, useState } from "react";

type SubmitState =
  | { status: "idle"; message: string }
  | { status: "submitting"; message: string }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

type Option = { value: string; label: string };

const ROLE_OPTIONS: Option[] = [
  { value: "Attendee", label: "Attendee" },
  { value: "Speaker", label: "Speaker" },
  { value: "Partner / Sponsor", label: "Partner / Sponsor" },
  { value: "Media", label: "Media" },
  { value: "Other", label: "Other" },
];

const GLASS_INPUT_CLASS =
  "w-full rounded-xl border border-white/55 bg-white/45 px-3 py-2 text-sm text-[#0f172a] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] outline-none backdrop-blur-md focus:border-[#99f6e4] focus:ring-2 focus:ring-[#99f6e4]/70";
const GLASS_SECTION_CLASS =
  "rounded-2xl border border-white/40 bg-white/25 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.14)] backdrop-blur-xl sm:p-6";
const GLASS_BRANCH_SECTION_CLASS =
  "rounded-2xl border border-white/40 bg-[#ecfeff]/25 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.14)] backdrop-blur-xl sm:p-6";

function FieldLabel({ htmlFor, children, required = false }: { htmlFor: string; children: string; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-[#1f2937]">
      {children}
      {required ? <span className="text-red-600"> *</span> : null}
    </label>
  );
}

function TextInput({
  id,
  name,
  label,
  required = false,
  type = "text",
}: {
  id: string;
  name: string;
  label: string;
  required?: boolean;
  type?: "text" | "email";
}) {
  return (
    <div>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        className={GLASS_INPUT_CLASS}
      />
    </div>
  );
}

function TextArea({ id, name, label, required = false }: { id: string; name: string; label: string; required?: boolean }) {
  return (
    <div>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      <textarea
        id={id}
        name={name}
        required={required}
        rows={4}
        className={`${GLASS_INPUT_CLASS} min-h-[110px]`}
      />
    </div>
  );
}

function SelectInput({
  id,
  name,
  label,
  options,
  required = false,
  onChange,
}: {
  id: string;
  name: string;
  label: string;
  options: Option[];
  required?: boolean;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
}) {
  return (
    <div>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      <select
        id={id}
        name={name}
        required={required}
        defaultValue=""
        onChange={onChange}
        className={GLASS_INPUT_CLASS}
      >
        <option value="" disabled>
          Select an option
        </option>
        {options.map((opt) => (
          <option key={`${id}-${opt.value}`} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ScaleInput({
  id,
  name,
  label,
  min,
  max,
  required = false,
}: {
  id: string;
  name: string;
  label: string;
  min: number;
  max: number;
  required?: boolean;
}) {
  const options = Array.from({ length: max - min + 1 }, (_, idx) => {
    const value = String(min + idx);
    return { value, label: value };
  });

  return <SelectInput id={id} name={name} label={label} options={options} required={required} />;
}

function CheckboxGroup({
  legend,
  name,
  options,
}: {
  legend: string;
  name: string;
  options: string[];
}) {
  return (
    <fieldset className="rounded-xl border border-white/40 bg-white/30 p-4 backdrop-blur-md">
      <legend className="px-1 text-sm font-medium text-[#1f2937]">{legend}</legend>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {options.map((option) => (
          <label key={`${name}-${option}`} className="flex items-center gap-2 text-sm text-[#374151]">
            <input type="checkbox" name={name} value={option} className="h-4 w-4 accent-[#0d9488]" />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function toPayload(formData: FormData): Record<string, string | string[]> {
  const payload: Record<string, string | string[]> = {};

  for (const [key, value] of formData.entries()) {
    const textValue = String(value).trim();
    if (!textValue) continue;

    const existing = payload[key];
    if (existing === undefined) {
      payload[key] = textValue;
      continue;
    }

    if (Array.isArray(existing)) {
      existing.push(textValue);
      continue;
    }

    payload[key] = [existing, textValue];
  }

  return payload;
}

export default function ElevationRetreatFeedbackForm() {
  const [role, setRole] = useState("");
  const [q28, setQ28] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle", message: "" });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitState({ status: "submitting", message: "Submitting your feedback..." });

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/elevation-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: toPayload(formData) }),
      });

      const result = (await response.json()) as { ok: boolean; message?: string };

      if (!response.ok || !result.ok) {
        setSubmitState({
          status: "error",
          message: result.message ?? "We could not submit your feedback. Please try again.",
        });
        return;
      }

      form.reset();
      setRole("");
      setQ28("");
      setSubmitState({ status: "success", message: "Thank you. Your feedback has been submitted." });
    } catch {
      setSubmitState({
        status: "error",
        message: "Network error while submitting feedback. Please try again.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8" style={{ fontFamily: "DIN, sans-serif" }}>
      <section className={GLASS_SECTION_CLASS}>
        <h2 className="mb-4 text-lg font-semibold text-[#111827]">Section 1: Basic Information</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput id="q1_fullName" name="q1_fullName" label="1. Full name" required />
          <TextInput id="q2_email" name="q2_email" label="2. Email address" type="email" required />
          <TextInput id="q3_country" name="q3_country" label="3. Country of residence" />
          <SelectInput
            id="q4_role"
            name="q4_role"
            label="4. Which best describes you?"
            options={ROLE_OPTIONS}
            required
            onChange={(event) => setRole(event.target.value)}
          />
          <SelectInput
            id="q5_attendance"
            name="q5_attendance"
            label="5. Did you attend the retreat in full or in part?"
            options={[
              { value: "Full retreat", label: "Full retreat" },
              { value: "Most of the retreat", label: "Most of the retreat" },
              {
                value: "Selected sessions / selected days only",
                label: "Selected sessions / selected days only",
              },
            ]}
          />
        </div>
      </section>

      <section className={GLASS_SECTION_CLASS}>
        <h2 className="mb-4 text-lg font-semibold text-[#111827]">Section 2: Overall Experience</h2>
        <div className="space-y-4">
          <ScaleInput
            id="q6_overall_rating"
            name="q6_overall_rating"
            label="6. Overall, how would you rate your Elevation Retreat experience? (1 = Poor, 10 = Exceptional)"
            min={1}
            max={10}
            required
          />
          <SelectInput
            id="q7_expectations"
            name="q7_expectations"
            label="7. How would you describe the retreat overall?"
            options={[
              { value: "Far below expectations", label: "Far below expectations" },
              { value: "Below expectations", label: "Below expectations" },
              { value: "Met expectations", label: "Met expectations" },
              { value: "Exceeded expectations", label: "Exceeded expectations" },
              { value: "Greatly exceeded expectations", label: "Greatly exceeded expectations" },
            ]}
          />
          <TextInput
            id="q8_three_words"
            name="q8_three_words"
            label="8. Which three words best describe your Elevation Retreat experience?"
          />
          <TextArea
            id="q9_memorable"
            name="q9_memorable"
            label="9. What was the most memorable part of the retreat for you?"
            required
          />
          <CheckboxGroup
            legend="10. What aspect of the retreat delivered the most value to you?"
            name="q10_value_aspects"
            options={[
              "Workshops / learning sessions",
              "Speaker sessions",
              "Networking / connections",
              "Personal reflection / transformation",
              "Excursions / curated experiences",
              "Hospitality / environment",
              "Conversations with the team",
              "Other",
            ]}
          />
          <ScaleInput
            id="q11_curated_premium"
            name="q11_curated_premium"
            label="11. To what extent did the retreat feel intentional, well-curated, and premium?"
            min={1}
            max={10}
          />
          <ScaleInput
            id="q12_recommend"
            name="q12_recommend"
            label="12. How likely are you to recommend Elevation Retreat to a friend, colleague, or peer? (0 = Not likely at all, 10 = Extremely likely)"
            min={0}
            max={10}
            required
          />
          <TextArea id="q13_recommend_reason" name="q13_recommend_reason" label="13. What made you choose that rating?" />
        </div>
      </section>

      <section className={GLASS_SECTION_CLASS}>
        <h2 className="mb-4 text-lg font-semibold text-[#111827]">Section 3: Programme Experience</h2>
        <div className="space-y-4">
          <ScaleInput
            id="q14_programme_quality"
            name="q14_programme_quality"
            label="14. How would you rate the quality of the overall programme?"
            min={1}
            max={10}
          />
          <ScaleInput
            id="q15_programme_balance"
            name="q15_programme_balance"
            label="15. How would you rate the balance between inspiration, practical value, and connection?"
            min={1}
            max={10}
          />
          <SelectInput
            id="q16_relevance"
            name="q16_relevance"
            label="16. Were the sessions relevant to your current season of life, work, or leadership?"
            options={[
              { value: "Extremely relevant", label: "Extremely relevant" },
              { value: "Very relevant", label: "Very relevant" },
              { value: "Somewhat relevant", label: "Somewhat relevant" },
              { value: "Slightly relevant", label: "Slightly relevant" },
              { value: "Not relevant", label: "Not relevant" },
            ]}
          />
          <TextArea
            id="q17_most_impactful"
            name="q17_most_impactful"
            label="17. Which session, conversation, or moment impacted you the most, and why?"
            required
          />
          <SelectInput
            id="q18_connection_room"
            name="q18_connection_room"
            label="18. Did you feel the retreat created enough room for genuine connection and meaningful conversations?"
            options={[
              { value: "Yes, absolutely", label: "Yes, absolutely" },
              { value: "Mostly yes", label: "Mostly yes" },
              { value: "Somewhat", label: "Somewhat" },
              { value: "Not really", label: "Not really" },
              { value: "Not at all", label: "Not at all" },
            ]}
          />
          <CheckboxGroup
            legend="19. What would you have liked more of?"
            name="q19_more_of"
            options={[
              "More practical workshops",
              "More networking time",
              "More downtime / rest",
              "More wellness activities",
              "More speaker access",
              "More intimate discussion circles",
              "More entertainment / social moments",
              "More local cultural experiences",
              "Other",
            ]}
          />
          <TextArea id="q20_less_of" name="q20_less_of" label="20. What would you have liked less of?" />
        </div>
      </section>

      <section className={GLASS_SECTION_CLASS}>
        <h2 className="mb-4 text-lg font-semibold text-[#111827]">Section 4: Logistics, Hospitality, and Delivery</h2>
        <div className="space-y-4">
          <ScaleInput
            id="q21_pre_retreat_comms"
            name="q21_pre_retreat_comms"
            label="21. How would you rate communication before the retreat?"
            min={1}
            max={10}
          />
          <ScaleInput
            id="q22_checkin_arrival"
            name="q22_checkin_arrival"
            label="22. How would you rate the check-in / arrival experience?"
            min={1}
            max={10}
          />
          <ScaleInput
            id="q23_accommodation"
            name="q23_accommodation"
            label="23. How would you rate accommodation and comfort?"
            min={1}
            max={10}
          />
          <ScaleInput
            id="q24_transportation"
            name="q24_transportation"
            label="24. How would you rate transportation / logistics coordination?"
            min={1}
            max={10}
          />
          <ScaleInput
            id="q25_food"
            name="q25_food"
            label="25. How would you rate food and dining experiences?"
            min={1}
            max={10}
          />
          <ScaleInput
            id="q26_venue"
            name="q26_venue"
            label="26. How would you rate the venues and atmosphere?"
            min={1}
            max={10}
          />
          <ScaleInput
            id="q27_team"
            name="q27_team"
            label="27. How would you rate the warmth, professionalism, and helpfulness of the team?"
            min={1}
            max={10}
          />
          <SelectInput
            id="q28_confused"
            name="q28_confused"
            label="28. Was there any moment where you felt confused, unsupported, or unclear about what was happening next?"
            options={[
              { value: "No", label: "No" },
              { value: "Yes", label: "Yes" },
            ]}
            onChange={(event) => setQ28(event.target.value)}
          />
          {q28 === "Yes" ? (
            <TextArea id="q29_confusion_details" name="q29_confusion_details" label="29. If yes, please tell us what happened." />
          ) : null}
          <TextArea
            id="q30_operational_improvement"
            name="q30_operational_improvement"
            label="30. What is one thing we should improve operationally for future editions?"
          />
        </div>
      </section>

      {role === "Attendee" ? (
        <section className={GLASS_BRANCH_SECTION_CLASS}>
          <h2 className="mb-4 text-lg font-semibold text-[#0f172a]">Section 5A: Attendee Path</h2>
          <div className="space-y-4">
            <ScaleInput
              id="q31a_expectations_clarity"
              name="q31a_expectations_clarity"
              label="31. How easy was it to understand what was expected of you before arriving?"
              min={1}
              max={10}
            />
            <ScaleInput
              id="q32a_app_helpfulness"
              name="q32a_app_helpfulness"
              label="32. How helpful was the app / digital communication in guiding your retreat experience?"
              min={1}
              max={10}
            />
            <SelectInput
              id="q33a_welcomed"
              name="q33a_welcomed"
              label="33. Did you feel welcomed and included throughout the retreat?"
              options={[
                { value: "Yes, completely", label: "Yes, completely" },
                { value: "Mostly", label: "Mostly" },
                { value: "Somewhat", label: "Somewhat" },
                { value: "Not really", label: "Not really" },
                { value: "Not at all", label: "Not at all" },
              ]}
            />
            <SelectInput
              id="q34a_connections"
              name="q34a_connections"
              label="34. Did the retreat help you make valuable new connections?"
              options={[
                { value: "Yes, many", label: "Yes, many" },
                { value: "Yes, a few meaningful ones", label: "Yes, a few meaningful ones" },
                { value: "Some, but not many", label: "Some, but not many" },
                { value: "Very few", label: "Very few" },
                { value: "Not at all", label: "Not at all" },
              ]}
            />
            <SelectInput
              id="q35a_transformation"
              name="q35a_transformation"
              label="35. Did you feel personally transformed, stretched, or elevated by the experience?"
              options={[
                { value: "Yes, deeply", label: "Yes, deeply" },
                { value: "Yes, somewhat", label: "Yes, somewhat" },
                { value: "A little", label: "A little" },
                { value: "Not really", label: "Not really" },
                { value: "Not at all", label: "Not at all" },
              ]}
            />
            <TextArea
              id="q36a_shift"
              name="q36a_shift"
              label="36. In what way did the retreat shift your thinking, confidence, clarity, or direction?"
            />
            <TextArea
              id="q37a_best_design"
              name="q37a_best_design"
              label="37. Which part of the attendee experience felt most thoughtfully designed?"
            />
            <TextArea
              id="q38a_weakest"
              name="q38a_weakest"
              label="38. Which part of the attendee experience felt weakest or least useful?"
            />
            <ScaleInput
              id="q39a_networking_support"
              name="q39a_networking_support"
              label="39. Did you feel there was enough support for networking and relationship-building?"
              min={1}
              max={10}
            />
            <CheckboxGroup
              legend="40. What kind of follow-up would help you most after this retreat?"
              name="q40a_followup"
              options={[
                "Access to speaker resources",
                "A private alumni community",
                "Curated networking introductions",
                "Post-retreat reflection prompts",
                "Accountability / mastermind circles",
                "Business / brand support",
                "Retreat photo / video memories",
                "Early access to the next retreat",
                "Other",
              ]}
            />
            <SelectInput
              id="q41a_attend_again"
              name="q41a_attend_again"
              label="41. Would you attend another Atinuda / Elevation experience?"
              options={[
                { value: "Yes, definitely", label: "Yes, definitely" },
                { value: "Very likely", label: "Very likely" },
                { value: "Maybe", label: "Maybe" },
                { value: "Unlikely", label: "Unlikely" },
                { value: "No", label: "No" },
              ]}
            />
            <TextArea
              id="q42a_immediate_yes"
              name="q42a_immediate_yes"
              label="42. What would make you say an immediate yes to the next one?"
            />
          </div>
        </section>
      ) : null}

      {role === "Speaker" ? (
        <section className={GLASS_BRANCH_SECTION_CLASS}>
          <h2 className="mb-4 text-lg font-semibold text-[#0f172a]">Section 5B: Speaker Path</h2>
          <div className="space-y-4">
            <ScaleInput
              id="q31b_team_comms"
              name="q31b_team_comms"
              label="31. How would you rate communication with the team before the retreat?"
              min={1}
              max={10}
            />
            <ScaleInput
              id="q32b_briefing"
              name="q32b_briefing"
              label="32. How clear was your briefing and preparation process?"
              min={1}
              max={10}
            />
            <ScaleInput
              id="q33b_support"
              name="q33b_support"
              label="33. How supported did you feel by the team before and during your session?"
              min={1}
              max={10}
            />
            <ScaleInput
              id="q34b_stage_management"
              name="q34b_stage_management"
              label="34. How would you rate session moderation / stage management / flow?"
              min={1}
              max={10}
            />
            <ScaleInput
              id="q35b_audience_engagement"
              name="q35b_audience_engagement"
              label="35. How would you rate the audience engagement and quality of participation?"
              min={1}
              max={10}
            />
            <SelectInput
              id="q36b_positioning"
              name="q36b_positioning"
              label="36. Did you feel your expertise was positioned well and received with the right context?"
              options={[
                { value: "Yes, absolutely", label: "Yes, absolutely" },
                { value: "Mostly", label: "Mostly" },
                { value: "Somewhat", label: "Somewhat" },
                { value: "Not really", label: "Not really" },
                { value: "Not at all", label: "Not at all" },
              ]}
            />
            <TextArea
              id="q37b_audience_quality"
              name="q37b_audience_quality"
              label="37. How would you describe the quality of the audience you engaged with?"
            />
            <TextArea
              id="q38b_more_support"
              name="q38b_more_support"
              label="38. Was there anything that would have helped you deliver even more effectively?"
            />
            <ScaleInput
              id="q39b_onsite_support"
              name="q39b_onsite_support"
              label="39. How would you rate the technical, logistical, and on-site support available to you?"
              min={1}
              max={10}
            />
            <SelectInput
              id="q40b_brand_alignment"
              name="q40b_brand_alignment"
              label="40. Did the retreat environment feel aligned with your personal brand and professional standards?"
              options={[
                { value: "Yes, very aligned", label: "Yes, very aligned" },
                { value: "Mostly aligned", label: "Mostly aligned" },
                { value: "Somewhat aligned", label: "Somewhat aligned" },
                { value: "Not very aligned", label: "Not very aligned" },
                { value: "Not aligned", label: "Not aligned" },
              ]}
            />
            <SelectInput
              id="q41b_open_future"
              name="q41b_open_future"
              label="41. Would you be open to speaking at or supporting a future Elevation / Atinuda experience?"
              options={[
                { value: "Yes, definitely", label: "Yes, definitely" },
                { value: "Likely", label: "Likely" },
                { value: "Maybe", label: "Maybe" },
                { value: "Unlikely", label: "Unlikely" },
                { value: "No", label: "No" },
              ]}
            />
            <SelectInput
              id="q42b_recommend_platform"
              name="q42b_recommend_platform"
              label="42. Would you recommend this platform to other high-level speakers or collaborators?"
              options={[
                { value: "Yes, definitely", label: "Yes, definitely" },
                { value: "Likely", label: "Likely" },
                { value: "Maybe", label: "Maybe" },
                { value: "Unlikely", label: "Unlikely" },
                { value: "No", label: "No" },
              ]}
            />
            <TextArea
              id="q43b_speaker_improvement"
              name="q43b_speaker_improvement"
              label="43. What would make the speaker experience even stronger next time?"
            />
          </div>
        </section>
      ) : null}

      {role !== "" && role !== "Attendee" && role !== "Speaker" ? (
        <section className={GLASS_BRANCH_SECTION_CLASS}>
          <h2 className="mb-4 text-lg font-semibold text-[#0f172a]">Section 5C: Partner / Sponsor / Media / Other Path</h2>
          <div className="space-y-4">
            <ScaleInput
              id="q31c_participation_value"
              name="q31c_participation_value"
              label="31. How would you rate the value of your participation?"
              min={1}
              max={10}
            />
            <SelectInput
              id="q32c_audience_alignment"
              name="q32c_audience_alignment"
              label="32. Did the retreat audience align with the kind of people you hoped to connect with?"
              options={[
                { value: "Yes, strongly", label: "Yes, strongly" },
                { value: "Mostly", label: "Mostly" },
                { value: "Somewhat", label: "Somewhat" },
                { value: "Not really", label: "Not really" },
                { value: "Not at all", label: "Not at all" },
              ]}
            />
            <SelectInput
              id="q33c_visibility"
              name="q33c_visibility"
              label="33. Did the retreat create meaningful visibility or relationship opportunities for you?"
              options={[
                { value: "Yes, very much", label: "Yes, very much" },
                { value: "Yes, somewhat", label: "Yes, somewhat" },
                { value: "A little", label: "A little" },
                { value: "Not really", label: "Not really" },
                { value: "Not at all", label: "Not at all" },
              ]}
            />
            <TextArea
              id="q34c_worthwhile"
              name="q34c_worthwhile"
              label="34. What made participation worthwhile for you?"
            />
            <TextArea
              id="q35c_partnership_improvement"
              name="q35c_partnership_improvement"
              label="35. What could make future partnership participation more valuable?"
            />
          </div>
        </section>
      ) : null}

      <section className={GLASS_SECTION_CLASS}>
        <h2 className="mb-4 text-lg font-semibold text-[#111827]">Section 6: Brand, Impact, and Future Interest</h2>
        <div className="space-y-4">
          <SelectInput
            id="q44_distinct"
            name="q44_distinct"
            label="44. Did Elevation Retreat feel distinct from other conferences or retreats you have attended?"
            options={[
              { value: "Yes, strongly distinct", label: "Yes, strongly distinct" },
              { value: "Somewhat distinct", label: "Somewhat distinct" },
              { value: "Not really distinct", label: "Not really distinct" },
              { value: "Not sure", label: "Not sure" },
            ]}
          />
          <TextArea id="q45_what_different" name="q45_what_different" label="45. What made it feel different?" />
          <TextArea
            id="q46_never_change"
            name="q46_never_change"
            label="46. What should never change about Elevation Retreat?"
            required
          />
          <TextArea
            id="q47_must_improve"
            name="q47_must_improve"
            label="47. What absolutely must improve before the next edition?"
          />
          <CheckboxGroup
            legend="48. What type of future experience would interest you most?"
            name="q48_future_interest"
            options={[
              "Another retreat",
              "A conference / summit",
              "Smaller private mastermind",
              "Online sessions / community",
              "Luxury leadership experience",
              "Creative / business immersion",
              "Women-focused gathering",
              "Curated networking dinners",
              "Other",
            ]}
          />
          <SelectInput
            id="q49_future_updates"
            name="q49_future_updates"
            label="49. Would you like to hear about future Atinuda / Elevation experiences?"
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" },
            ]}
            required
          />
        </div>
      </section>

      <section className={GLASS_SECTION_CLASS}>
        <h2 className="mb-4 text-lg font-semibold text-[#111827]">Section 7: Testimonial and Permission</h2>
        <div className="space-y-4">
          <TextArea
            id="q50_testimonial"
            name="q50_testimonial"
            label="50. Please share a short testimonial about your Elevation Retreat experience."
          />
          <SelectInput
            id="q51_permission"
            name="q51_permission"
            label="51. May we use your feedback or testimonial in our marketing materials, with your name?"
            options={[
              { value: "Yes, with my full name", label: "Yes, with my full name" },
              { value: "Yes, but first name only", label: "Yes, but first name only" },
              { value: "Yes, anonymously", label: "Yes, anonymously" },
              { value: "No", label: "No" },
            ]}
            required
          />
          <SelectInput
            id="q52_video_followup"
            name="q52_video_followup"
            label="52. May we contact you for a short video testimonial or follow-up conversation?"
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" },
            ]}
          />
          <TextArea id="q53_anything_else" name="q53_anything_else" label="53. Is there anything else you would like us to know?" />
        </div>
      </section>

      <input type="hidden" name="form_title" value="Elevation Retreat Reflection & Feedback" />

      <button
        type="submit"
        disabled={submitState.status === "submitting"}
        className="w-full rounded-xl border border-white/40 bg-gradient-to-r from-[#0f766e]/95 to-[#155e75]/95 px-4 py-3 text-sm font-semibold tracking-wide text-white shadow-lg transition hover:from-[#115e59] hover:to-[#0e7490] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitState.status === "submitting" ? "Submitting..." : "Submit Feedback"}
      </button>

      {submitState.status !== "idle" ? (
        <p
          className={`rounded-lg border px-4 py-3 text-sm ${
            submitState.status === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : submitState.status === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-slate-200 bg-slate-50 text-slate-700"
          }`}
        >
          {submitState.message}
        </p>
      ) : null}
    </form>
  );
}

"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import FadeIn from "@/components/ui/FadeIn";
import SectionHeading from "@/components/ui/SectionHeading";

const inputStyles =
  "w-full rounded-lg border border-cream-300 bg-white px-4 py-3 text-sm text-charcoal-900 placeholder:text-charcoal-700/50 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-shadow";
const labelStyles = "block text-sm font-medium text-charcoal-900 mb-1.5";

interface FormFields {
  studentName: string;
  grade: string;
  subjects: string;
  sessionFormat: string;
  preferredTimes: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  notes: string;
}

const EMPTY: FormFields = {
  studentName: "",
  grade: "",
  subjects: "",
  sessionFormat: "",
  preferredTimes: "",
  parentName: "",
  parentEmail: "",
  parentPhone: "",
  notes: "",
};

type Status = "idle" | "submitting" | "success" | "error";

export default function Contact() {
  const [fields, setFields] = useState<FormFields>(EMPTY);
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const set = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (honeypot) {
      // Bot filled the honeypot — silently succeed
      setStatus("success");
      return;
    }

    setStatus("submitting");
    setErrorMsg("");
    setFieldErrors({});

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        const data = await res.json();
        if (data.fields) setFieldErrors(data.fields);
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <section id="contact" className="py-20 md:py-28 bg-cream-50">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <FadeIn>
            <div className="bg-white border border-cream-300 rounded-2xl p-12">
              <div className="w-16 h-16 rounded-full bg-forest-600/10 flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-forest-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-charcoal-900 mb-3">Thanks!</h2>
              <p className="text-charcoal-700 leading-relaxed">
                We&rsquo;ll reach out within 24 hours to schedule your free consultation.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-20 md:py-28 bg-cream-50">
      <div className="max-w-2xl mx-auto px-6">
        <FadeIn>
          <SectionHeading
            title="Let's get started"
            subtitle="Fill out the form and we'll match your student with the right tutor."
          />
        </FadeIn>

        <FadeIn>
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-cream-300 rounded-2xl p-8 md:p-10 space-y-6"
          >
            {/* Honeypot — hidden from humans, filled by bots */}
            <div
              aria-hidden="true"
              style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }}
            >
              <label htmlFor="_gotcha">Leave this blank</label>
              <input
                id="_gotcha"
                type="text"
                name="_gotcha"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {status === "error" && errorMsg && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                {errorMsg}
              </div>
            )}

            {/* Student's First Name */}
            <div>
              <label htmlFor="studentName" className={labelStyles}>
                Student&rsquo;s First Name
              </label>
              <input
                id="studentName"
                type="text"
                name="studentName"
                required
                autoComplete="given-name"
                value={fields.studentName}
                onChange={set}
                className={inputStyles}
                placeholder="e.g. Sarah"
              />
              {fieldErrors.studentName && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.studentName}</p>
              )}
            </div>

            {/* Grade + Subject row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="grade" className={labelStyles}>
                  Grade
                </label>
                <select
                  id="grade"
                  name="grade"
                  required
                  value={fields.grade}
                  onChange={set}
                  className={inputStyles}
                >
                  <option value="" disabled>
                    Select grade
                  </option>
                  <option value="9">Grade 9</option>
                  <option value="10">Grade 10</option>
                  <option value="11">Grade 11</option>
                  <option value="12">Grade 12</option>
                </select>
                {fieldErrors.grade && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.grade}</p>
                )}
              </div>
              <div>
                <label htmlFor="subjects" className={labelStyles}>
                  Subject(s) Needed
                </label>
                <input
                  id="subjects"
                  type="text"
                  name="subjects"
                  required
                  value={fields.subjects}
                  onChange={set}
                  className={inputStyles}
                  placeholder="e.g. MCR3U, SCH4U"
                />
                {fieldErrors.subjects && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.subjects}</p>
                )}
              </div>
            </div>

            {/* Session Format */}
            <fieldset>
              <legend className={labelStyles}>Session Format</legend>
              <div className="flex flex-wrap gap-4 mt-1">
                {["In-Person", "Online", "Either"].map((option) => (
                  <label key={option} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sessionFormat"
                      value={option}
                      required
                      checked={fields.sessionFormat === option}
                      onChange={set}
                      className="w-4 h-4 text-forest-600 accent-forest-600"
                    />
                    <span className="text-sm text-charcoal-800">{option}</span>
                  </label>
                ))}
              </div>
              {fieldErrors.sessionFormat && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.sessionFormat}</p>
              )}
            </fieldset>

            {/* Preferred Days & Times */}
            <div>
              <label htmlFor="preferredTimes" className={labelStyles}>
                Preferred Days &amp; Times{" "}
                <span className="text-charcoal-700/50 font-normal">(optional)</span>
              </label>
              <input
                id="preferredTimes"
                type="text"
                name="preferredTimes"
                value={fields.preferredTimes}
                onChange={set}
                className={inputStyles}
                placeholder="e.g. Weekday evenings, Saturday mornings"
              />
            </div>

            {/* Parent/Guardian Name */}
            <div>
              <label htmlFor="parentName" className={labelStyles}>
                Parent/Guardian Name
              </label>
              <input
                id="parentName"
                type="text"
                name="parentName"
                required
                autoComplete="name"
                value={fields.parentName}
                onChange={set}
                className={inputStyles}
                placeholder="Full name"
              />
              {fieldErrors.parentName && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.parentName}</p>
              )}
            </div>

            {/* Parent Email + Phone row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="parentEmail" className={labelStyles}>
                  Parent/Guardian Email
                </label>
                <input
                  id="parentEmail"
                  type="email"
                  name="parentEmail"
                  required
                  autoComplete="email"
                  value={fields.parentEmail}
                  onChange={set}
                  className={inputStyles}
                  placeholder="email@example.com"
                />
                {fieldErrors.parentEmail && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.parentEmail}</p>
                )}
              </div>
              <div>
                <label htmlFor="parentPhone" className={labelStyles}>
                  Parent/Guardian Phone
                </label>
                <input
                  id="parentPhone"
                  type="tel"
                  name="parentPhone"
                  required
                  autoComplete="tel"
                  pattern="[\+]?[\d\s\-\(\)]{7,20}"
                  title="Please enter a valid phone number"
                  value={fields.parentPhone}
                  onChange={set}
                  className={inputStyles}
                  placeholder="(905) 000-0000"
                />
                {fieldErrors.parentPhone && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.parentPhone}</p>
                )}
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label htmlFor="notes" className={labelStyles}>
                Additional Notes{" "}
                <span className="text-charcoal-700/50 font-normal">(optional)</span>
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                value={fields.notes}
                onChange={set}
                className={inputStyles}
                placeholder="Anything else we should know — learning style, upcoming tests, specific topics, etc."
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full rounded-lg bg-forest-600 px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-forest-500 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {status === "submitting" ? "Sending…" : "Book My Free Consultation"}
            </button>
          </form>
        </FadeIn>
      </div>
    </section>
  );
}

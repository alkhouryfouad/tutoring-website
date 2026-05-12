"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import FadeIn from "@/components/ui/FadeIn";

const inputStyles =
  "w-full rounded-lg border border-cream-300 bg-white px-4 py-2.5 text-sm text-charcoal-900 placeholder:text-charcoal-700/50 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-shadow";
const labelStyles = "block text-sm font-medium text-charcoal-900 mb-1.5";

interface Fields {
  name: string;
  email: string;
  message: string;
}

const EMPTY: Fields = { name: "", email: "", message: "" };

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactSimple() {
  const [open, setOpen] = useState(false);
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const set = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (honeypot) {
      setStatus("success");
      return;
    }

    setStatus("submitting");
    setErrorMsg("");
    setFieldErrors({});

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, _gotcha: honeypot }),
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
      <section id="message" className="py-12 md:py-16 bg-cream-50 border-t border-cream-200">
        <div className="max-w-md mx-auto px-6 text-center">
          <FadeIn>
            <div className="bg-white border border-cream-300 rounded-2xl p-8">
              <div className="w-12 h-12 rounded-full bg-forest-600/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-forest-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-charcoal-900 mb-1.5">Message sent</h3>
              <p className="text-charcoal-700 text-sm">
                Thanks for reaching out. We&rsquo;ll get back to you soon.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>
    );
  }

  return (
    <section id="message" className="py-10 md:py-14 bg-cream-50 border-t border-cream-200">
      <div className="max-w-md mx-auto px-6">
        <div className="text-center">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="quick-question-form"
            className="inline-flex items-center gap-2 text-sm font-medium text-charcoal-700 hover:text-forest-600 transition-colors"
          >
            <span
              aria-hidden="true"
              className={`inline-block w-5 h-5 rounded-full bg-cream-200 text-charcoal-700 text-xs leading-5 transition-transform ${open ? "rotate-45" : ""}`}
            >
              +
            </span>
            {open ? "Hide" : "Have a quick question instead?"}
          </button>
        </div>

        {open && (
          <div id="quick-question-form" className="mt-6">
            <FadeIn>
              <form
                onSubmit={handleSubmit}
                className="bg-white border border-cream-300 rounded-2xl p-6 space-y-4"
              >
                <div
                  aria-hidden="true"
                  style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }}
                >
                  <label htmlFor="_gotcha_msg">Leave this blank</label>
                  <input
                    id="_gotcha_msg"
                    type="text"
                    name="_gotcha"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {status === "error" && errorMsg && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label htmlFor="cs-name" className={labelStyles}>Your name</label>
                  <input
                    id="cs-name"
                    type="text"
                    name="name"
                    required
                    autoComplete="name"
                    value={fields.name}
                    onChange={set}
                    className={inputStyles}
                    placeholder="Full name"
                  />
                  {fieldErrors.name && <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>}
                </div>

                <div>
                  <label htmlFor="cs-email" className={labelStyles}>Email</label>
                  <input
                    id="cs-email"
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    value={fields.email}
                    onChange={set}
                    className={inputStyles}
                    placeholder="email@example.com"
                  />
                  {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
                </div>

                <div>
                  <label htmlFor="cs-message" className={labelStyles}>Message</label>
                  <textarea
                    id="cs-message"
                    name="message"
                    rows={4}
                    required
                    value={fields.message}
                    onChange={set}
                    className={inputStyles}
                    placeholder="What would you like to ask?"
                  />
                  {fieldErrors.message && <p className="mt-1 text-xs text-red-600">{fieldErrors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full rounded-lg bg-forest-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-forest-500 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {status === "submitting" ? "Sending…" : "Send message"}
                </button>

                <p className="text-[11px] text-charcoal-700/70 text-center leading-relaxed">
                  We only use this to reply.{" "}
                  <a href="/privacy" className="underline hover:text-forest-600 transition-colors">
                    Privacy
                  </a>.
                </p>
              </form>
            </FadeIn>
          </div>
        )}
      </div>
    </section>
  );
}

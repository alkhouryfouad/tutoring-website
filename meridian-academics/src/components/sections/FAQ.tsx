"use client";

import { useState } from "react";
import { faqs } from "@/data/faq";
import FadeIn from "@/components/ui/FadeIn";
import SectionHeading from "@/components/ui/SectionHeading";

export default function FAQ() {
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set());

  const toggle = (index: number) => {
    setOpenIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <section id="faq" className="py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-6">
        <FadeIn>
          <SectionHeading
            title="Frequently asked questions"
            subtitle="Everything you need to know before booking."
          />
        </FadeIn>

        <FadeIn>
          <div className="divide-y divide-cream-300 border-t border-b border-cream-300">
            {faqs.map((faq, i) => (
              <div key={i}>
                <button
                  id={`faq-btn-${i}`}
                  onClick={() => toggle(i)}
                  aria-expanded={openIndices.has(i)}
                  aria-controls={`faq-panel-${i}`}
                  className="w-full flex items-center justify-between py-5 text-left cursor-pointer group"
                >
                  <span className="font-semibold text-charcoal-900 pr-4 group-hover:text-forest-600 transition-colors">
                    {faq.question}
                  </span>
                  <span
                    className={`shrink-0 text-forest-600 text-xl transition-transform duration-200 ${
                      openIndices.has(i) ? "rotate-45" : ""
                    }`}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-btn-${i}`}
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndices.has(i)
                      ? "max-h-96 pb-5 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-charcoal-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

import { pricing, pricingNotes } from "@/data/pricing";
import FadeIn from "@/components/ui/FadeIn";
import SectionHeading from "@/components/ui/SectionHeading";

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn>
          <SectionHeading
            title="Simple, honest pricing"
            subtitle="No packages. No contracts. Pay per session."
          />
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricing.map((tier) => (
            <FadeIn key={tier.type}>
              <div
                className={`rounded-2xl p-8 h-full flex flex-col ${
                  tier.featured
                    ? "bg-white ring-2 ring-forest-600 shadow-lg relative"
                    : "bg-white border border-cream-300"
                }`}
              >
                {tier.featured && (
                  <span className="absolute -top-3 left-6 inline-flex items-center rounded-full bg-forest-600 px-3 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                )}
                <h3 className="text-xl font-semibold text-charcoal-900 mb-2">
                  {tier.type}
                </h3>
                <p className="text-sm text-charcoal-700 mb-6">
                  {tier.description}
                </p>
                <div className="space-y-3 flex-1">
                  {tier.rates.map((rate) => (
                    <div
                      key={rate.label}
                      className="flex items-center justify-between border-b border-cream-200 pb-3"
                    >
                      <span className="text-sm text-charcoal-700">
                        {rate.label}
                      </span>
                      <span className="font-serif font-bold text-lg text-forest-600">
                        {rate.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Notes */}
        <FadeIn>
          <ul className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
            {pricingNotes.map((note) => (
              <li
                key={note}
                className="flex items-start gap-2 text-sm text-charcoal-700"
              >
                <span className="mt-1 block w-1.5 h-1.5 rounded-full bg-forest-500 shrink-0" />
                {note}
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </section>
  );
}

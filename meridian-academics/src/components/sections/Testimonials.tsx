import { testimonials } from "@/data/testimonials";
import FadeIn from "@/components/ui/FadeIn";
import SectionHeading from "@/components/ui/SectionHeading";

export default function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-20 md:py-28 bg-cream-50">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn>
          <SectionHeading
            title="What students say"
            subtitle="Real results from real students in Oakville."
          />
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t, i) => (
            <FadeIn key={i}>
              <div className="bg-white border border-cream-300 rounded-2xl p-8 h-full relative">
                <span className="font-serif text-6xl text-forest-400/30 absolute top-4 left-6 leading-none select-none">
                  &ldquo;
                </span>
                <blockquote className="relative pt-8">
                  <p className="text-lg text-charcoal-800 leading-relaxed italic">
                    {t.quote}
                  </p>
                </blockquote>
                <div className="mt-6 pt-4 border-t border-cream-200">
                  <p className="font-semibold text-charcoal-900">
                    {t.studentName}
                  </p>
                  <p className="text-sm text-charcoal-700">
                    {t.grade} · {t.subject} · {t.school}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

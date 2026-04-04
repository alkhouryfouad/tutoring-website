import FadeIn from "@/components/ui/FadeIn";
import SectionHeading from "@/components/ui/SectionHeading";

const steps = [
  {
    number: "01",
    title: "Reach Out",
    description:
      "Fill out the form below or message us directly. Tell us the course, the grade, and what your student needs.",
  },
  {
    number: "02",
    title: "Get Matched",
    description:
      "We pair your student with the best tutor for their course and learning style. First consultation is free.",
  },
  {
    number: "03",
    title: "Start Learning",
    description:
      "Sessions happen at your home, a library, or online via Google Meet. Flexible scheduling around your student's life.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-forest-700">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn>
          <div className="mb-12 md:mb-16 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white tracking-tight">
              How it works
            </h2>
            <p className="mt-4 text-lg text-cream-300 max-w-2xl mx-auto leading-relaxed">
              Three steps. No commitments. No fine print.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <FadeIn key={step.number}>
              <div className="bg-forest-600/40 border border-forest-500/30 rounded-2xl p-8">
                <span className="font-serif font-bold text-5xl text-amber-400 block mb-4">
                  {step.number}
                </span>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-cream-300 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

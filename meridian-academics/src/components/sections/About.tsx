import FadeIn from "@/components/ui/FadeIn";
import SectionHeading from "@/components/ui/SectionHeading";

const stats = [
  { value: "97%", label: "Founder Average" },
  { value: "3", label: "Vetted Tutors" },
  { value: "15+", label: "Courses Offered" },
  { value: "2", label: "Session Formats" },
];

export default function About() {
  return (
    <section id="about" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn>
          <SectionHeading
            title="Built by students, for students"
            align="left"
          />
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
          {/* Text */}
          <FadeIn>
            <div className="space-y-5">
              <p className="text-lg text-charcoal-700 leading-relaxed">
                We started Meridian because we&rsquo;ve been where your student
                is. We sat in those same classrooms, used the same textbooks,
                wrote the same exams. The difference is we figured out how to do
                it well — and now we teach that.
              </p>
              <p className="text-lg text-charcoal-700 leading-relaxed">
                Every tutor on our team is a current university student who
                earned 90%+ in the courses they teach. We don&rsquo;t just know
                the material — we know the Ontario curriculum, the specific
                course codes, and exactly what your student&rsquo;s teacher is
                looking for.
              </p>
              <p className="text-lg text-charcoal-700 leading-relaxed">
                Whether it&rsquo;s at your kitchen table or over Google Meet, we
                make it easy. No contracts, no commitments — just real help from
                people who get it.
              </p>
            </div>
          </FadeIn>

          {/* Stats grid */}
          <FadeIn>
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-cream-50 border border-cream-300 rounded-2xl p-6 text-center"
                >
                  <p className="font-serif font-bold text-4xl md:text-5xl text-forest-600">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm font-medium text-charcoal-700">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

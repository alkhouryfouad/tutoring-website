"use client";

import Button from "@/components/ui/Button";
import FadeIn from "@/components/ui/FadeIn";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6 w-full py-32 md:py-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left — copy */}
          <FadeIn>
            <div className="space-y-6">
              <p className="text-sm font-medium uppercase tracking-widest text-forest-500">
                Math &amp; Science Tutoring — Oakville, ON
              </p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-charcoal-950 leading-[1.1]">
                Oakville&rsquo;s
                <br />
                <span className="text-forest-600">Sharpest</span> Tutors
              </h1>
              <p className="text-lg md:text-xl text-charcoal-700 leading-relaxed max-w-lg">
                Grade 9–12 math and science tutoring, taught by university
                students who aced these courses. In-person or online.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Button variant="primary" href="#contact">
                  Book Free Consultation
                </Button>
                <Button variant="ghost" href="#subjects">
                  View Our Courses
                </Button>
              </div>
              <p className="text-sm text-charcoal-700 pt-2">
                Founded by a{" "}
                <span className="font-semibold text-forest-600">97% student</span>.
                Now at the University of Guelph.
              </p>
            </div>
          </FadeIn>

          {/* Right — large 97% typographic element */}
          <FadeIn className="hidden md:flex items-center justify-center relative">
            <div className="relative select-none">
              <span
                className="font-serif font-black text-forest-600/10 leading-none"
                style={{ fontSize: "clamp(180px, 20vw, 320px)" }}
              >
                97
              </span>
              <span
                className="absolute -right-4 top-4 font-serif font-bold text-forest-600 rotate-[-8deg]"
                style={{ fontSize: "clamp(60px, 7vw, 100px)" }}
              >
                %
              </span>
              <div className="absolute -bottom-2 left-4 bg-amber-400 rounded-lg px-4 py-2 rotate-[3deg] shadow-lg">
                <p className="font-sans text-sm font-semibold text-charcoal-900">
                  Founder&rsquo;s Average
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

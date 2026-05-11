import { tutors } from "@/data/team";
import FadeIn from "@/components/ui/FadeIn";
import SectionHeading from "@/components/ui/SectionHeading";

export default function Team() {
  return (
    <section id="team" className="py-20 md:py-28 bg-cream-50">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn>
          <SectionHeading
            title="Meet the team"
            subtitle="Current university students who actually aced these courses."
          />
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tutors.map((tutor) => (
            <FadeIn key={tutor.name}>
              <div className="bg-white border border-cream-300 rounded-2xl p-8 h-full flex flex-col">
                {/* Avatar + name */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-forest-600 flex items-center justify-center shrink-0">
                    <span className="font-serif font-bold text-xl text-white">
                      {tutor.name[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-charcoal-900">
                      {tutor.name}
                    </h3>
                    <p className="text-sm text-charcoal-700">
                      {tutor.program} · {tutor.university}
                    </p>
                  </div>
                </div>

                {/* Year + Average */}
                <div className="flex gap-3 mb-4">
                  <span className="inline-flex items-center rounded-lg bg-cream-200 px-3 py-1 text-xs font-medium text-charcoal-700">
                    {tutor.year}
                  </span>
                  <span className="inline-flex items-center rounded-lg bg-forest-600/10 px-3 py-1 text-xs font-bold text-forest-600">
                    {tutor.average} avg
                  </span>
                </div>

                {/* Bio */}
                <p className="text-sm text-charcoal-700 leading-relaxed mb-5 flex-1">
                  {tutor.bio}
                </p>

                {/* Subject tags */}
                <div className="flex flex-wrap gap-1.5">
                  {tutor.subjects.map((code) => (
                    <span
                      key={code}
                      className="rounded-md bg-cream-200 px-2 py-1 text-xs font-medium text-charcoal-700"
                    >
                      {code}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

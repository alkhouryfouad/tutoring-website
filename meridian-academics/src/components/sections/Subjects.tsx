"use client";

import { useState } from "react";
import { grades } from "@/data/courses";
import FadeIn from "@/components/ui/FadeIn";
import SectionHeading from "@/components/ui/SectionHeading";
import GradeTabs from "@/components/ui/GradeTabs";

export default function Subjects() {
  const [activeGrade, setActiveGrade] = useState("12");

  const activeGroup = grades.find((g) => g.grade === activeGrade) ?? grades[0];

  return (
    <section id="subjects" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn>
          <SectionHeading
            title="What we teach"
            subtitle="Every course follows the Ontario curriculum. We know the course codes, the textbooks, and the exam formats."
          />
        </FadeIn>

        <FadeIn>
          <GradeTabs
            tabs={grades.map((g) => ({ grade: g.grade, label: g.label }))}
            active={activeGrade}
            onChange={setActiveGrade}
          />
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {activeGroup.courses.map((course) => (
            <FadeIn key={course.code}>
              <div className="bg-white border border-cream-300 rounded-2xl p-6 hover:shadow-md transition-shadow h-full">
                <span className="inline-block rounded-md bg-amber-400/20 px-2.5 py-1 text-xs font-bold text-amber-600 mb-3">
                  {course.code}
                </span>
                <h3 className="text-lg font-semibold text-charcoal-900 mb-2">
                  {course.name}
                </h3>
                <p className="text-sm text-charcoal-700 leading-relaxed mb-4">
                  {course.description}
                </p>
                <div className="flex gap-2">
                  {course.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-forest-600/10 px-3 py-1 text-xs font-medium text-forest-600"
                    >
                      {tag === "in-person" ? "In-Person" : "Online"}
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

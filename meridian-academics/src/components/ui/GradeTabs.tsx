"use client";

interface GradeTabsProps {
  tabs: { grade: string; label: string }[];
  active: string;
  onChange: (grade: string) => void;
}

export default function GradeTabs({ tabs, active, onChange }: GradeTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {tabs.map((tab) => (
        <button
          key={tab.grade}
          onClick={() => onChange(tab.grade)}
          className={`relative px-5 py-2.5 rounded-lg font-sans font-medium text-sm transition-all duration-200 cursor-pointer ${
            active === tab.grade
              ? "bg-forest-600 text-white shadow-md"
              : "bg-cream-200 text-charcoal-700 hover:bg-cream-300"
          }`}
        >
          {tab.label}
          {tab.grade === "12" && (
            <span className="ml-2 inline-flex items-center rounded-full bg-amber-400 px-2 py-0.5 text-xs font-semibold text-charcoal-900">
              Popular
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

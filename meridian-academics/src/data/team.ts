export interface Tutor {
  name: string;
  university: string;
  program: string;
  year: string;
  average: string;
  subjects: string[];
  bio: string;
  isFounder?: boolean;
}

export const tutors: Tutor[] = [
  {
    name: "Fouad",
    university: "University of Guelph",
    program: "Biomedical Science",
    year: "1st Year",
    average: "97%",
    subjects: ["MHF4U", "MCV4U", "SCH4U", "SCH3U", "MCR3U", "MPM2D", "MTH1W", "SNC1W", "SNC2D"],
    bio: "Founded Meridian after watching classmates struggle through courses he'd already mastered. Now studying Biomedical Science at Guelph, he brings first-hand knowledge of every Ontario math and science course.",
    isFounder: true,
  },
  {
    name: "Aisha",
    university: "McMaster University",
    program: "Health Sciences",
    year: "2nd Year",
    average: "95%",
    subjects: ["SBI4U", "SBI3U", "SCH4U", "SCH3U", "SNC2D", "SNC1W"],
    bio: "Specializes in biology and chemistry. Known for breaking down complex concepts into steps that actually make sense.",
  },
  {
    name: "Marcus",
    university: "University of Toronto",
    program: "Computer Science",
    year: "1st Year",
    average: "94%",
    subjects: ["MHF4U", "MCV4U", "MDM4U", "MCR3U", "SPH4U", "SPH3U", "MPM2D"],
    bio: "Math and physics are his thing. Tutors with a focus on building problem-solving intuition, not just memorizing formulas.",
  },
];
// NOTE: Aisha and Marcus are placeholder profiles. Replace with real tutor data before launch.

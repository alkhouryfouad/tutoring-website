export interface Tutor {
  name: string;
  university: string;
  program: string;
  year: string;
  average: string;
  subjects: string[];
  bio: string;
}

export const tutors: Tutor[] = [
  {
    name: "Fouad",
    university: "University of Guelph",
    program: "Biomedical Sciences",
    year: "2nd Year",
    average: "97%",
    subjects: ["MHF4U", "MCV4U", "SCH4U", "SCH3U", "MCR3U", "MPM2D", "MTH1W", "SNC1W", "SNC2D"],
    bio: "Started Meridian after helping classmates through the same courses he aced. Knows the Ontario math and science curriculum inside out.",
  },
  {
    name: "Murtadha",
    university: "McMaster University",
    program: "Electrical Engineering",
    year: "2nd Year",
    average: "97%",
    subjects: ["SPH4U", "SPH3U", "MHF4U", "MCV4U", "MCR3U", "MPM2D", "FSF4U", "FSF3U", "FSF2D", "FSF1D"],
    bio: "Teaches physics, advanced math, and French. Breaks tough problems into clear, step-by-step explanations.",
  },
  {
    name: "Sarah",
    university: "Western University — Ivey Business School",
    program: "HBA",
    year: "3rd Year",
    average: "98%",
    subjects: ["BAF3M", "BAT4M", "CIE3M", "CIA4U"],
    bio: "An Ivey HBA student who teaches accounting and economics through case-based examples and clear exam strategy.",
  },
];

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
    bio: "Founded Meridian after watching classmates struggle through courses he'd already mastered. Now studying Biomedical Sciences at Guelph, he brings first-hand knowledge of every Ontario math and science course.",
  },
  {
    name: "Murtadha",
    university: "McMaster University",
    program: "Electrical Engineering",
    year: "2nd Year",
    average: "97%",
    subjects: ["SPH4U", "SPH3U", "MHF4U", "MCV4U", "MCR3U", "MPM2D", "FSF4U", "FSF3U", "FSF2D", "FSF1D"],
    bio: "Specializes in physics, advanced math, and French. Brings an engineer's precision to problem-solving and knows how to make difficult concepts click.",
  },
  {
    name: "Sarah",
    university: "Western University — Ivey Business School",
    program: "HBA (Honours Business Administration)",
    year: "3rd Year",
    average: "98%",
    subjects: ["BAF3M", "BAT4M", "CIE3M", "CIA4U"],
    bio: "Top of her class through Ontario's business stream, now in the Ivey HBA program. Teaches accounting and economics with a focus on case-based learning and exam strategy.",
  },
];

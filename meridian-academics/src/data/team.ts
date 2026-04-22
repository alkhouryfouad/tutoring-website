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
    program: "Biomedical Sciences",
    year: "1st Year",
    average: "97%",
    subjects: ["MHF4U", "MCV4U", "SCH4U", "SCH3U", "MCR3U", "MPM2D", "MTH1W", "SNC1W", "SNC2D"],
    bio: "Founded Meridian after watching classmates struggle through courses he'd already mastered. Now studying Biomedical Sciences at Guelph, he brings first-hand knowledge of every Ontario math and science course.",
    isFounder: true,
  },
  {
    name: "Murtadha",
    university: "McMaster University",
    program: "Electrical Engineering",
    year: "2nd Year",
    average: "95%",
    subjects: ["SPH4U", "SPH3U", "MHF4U", "MCV4U", "MCR3U", "MPM2D"],
    bio: "Specializes in physics and advanced math. Brings an engineer's precision to problem-solving and knows how to make difficult concepts click.",
  },
  {
    name: "Marcus",
    university: "Laurier University",
    program: "Accounting and Finance",
    year: "1st Year",
    average: "94%",
    subjects: ["MDM4U", "MCR3U", "MPM2D", "MTH1W", "SNC2D", "SNC1W"],
    bio: "Strong in data management and foundational math. Tutors with a focus on building problem-solving intuition and real exam confidence.",
  },
];

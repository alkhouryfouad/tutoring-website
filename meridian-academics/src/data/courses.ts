export interface Course {
  code: string;
  name: string;
  description: string;
  tags: ("in-person" | "online")[];
}

export interface GradeGroup {
  grade: string;
  label: string;
  courses: Course[];
}

export const grades: GradeGroup[] = [
  {
    grade: "9",
    label: "Grade 9",
    courses: [
      { code: "MTH1W", name: "Mathematics", description: "Number sense, algebra, linear relations, data literacy, geometry", tags: ["in-person", "online"] },
      { code: "SNC1W", name: "Science", description: "Biology, chemistry, physics, and earth science fundamentals", tags: ["in-person", "online"] },
      { code: "FSF1D", name: "French", description: "Reading, writing, speaking, and listening aligned with the Ontario curriculum. Taught exclusively by Murtadha.", tags: ["in-person", "online"] },
    ],
  },
  {
    grade: "10",
    label: "Grade 10",
    courses: [
      { code: "MPM2D", name: "Math", description: "Quadratics, analytic geometry, trigonometry", tags: ["in-person", "online"] },
      { code: "SNC2D", name: "Science", description: "Tissues & organs, chemical reactions, light & optics, climate", tags: ["in-person", "online"] },
      { code: "FSF2D", name: "French", description: "Reading, writing, speaking, and listening aligned with the Ontario curriculum. Taught exclusively by Murtadha.", tags: ["in-person", "online"] },
    ],
  },
  {
    grade: "11",
    label: "Grade 11",
    courses: [
      { code: "MCR3U", name: "Functions", description: "Polynomial, exponential, and trigonometric functions", tags: ["in-person", "online"] },
      { code: "SCH3U", name: "Chemistry", description: "Matter, solutions, gases, and chemical reactions", tags: ["in-person", "online"] },
      { code: "SPH3U", name: "Physics", description: "Kinematics, forces, energy, waves, electricity", tags: ["in-person", "online"] },
      { code: "SBI3U", name: "Biology", description: "Diversity, evolution, genetics, anatomy", tags: ["in-person", "online"] },
      { code: "CIE3M", name: "Economics", description: "Supply & demand, market structures, government role, international trade", tags: ["in-person", "online"] },
      { code: "BAF3M", name: "Financial Accounting Fundamentals", description: "Accounting cycle, journals, ledgers, financial statements, partnerships", tags: ["in-person", "online"] },
      { code: "FSF3U", name: "French", description: "Reading, writing, speaking, and listening aligned with the Ontario curriculum. Taught exclusively by Murtadha.", tags: ["in-person", "online"] },
    ],
  },
  {
    grade: "12",
    label: "Grade 12",
    courses: [
      { code: "MHF4U", name: "Advanced Functions", description: "Polynomial, rational, logarithmic, and trigonometric functions", tags: ["in-person", "online"] },
      { code: "MCV4U", name: "Calculus & Vectors", description: "Limits, derivatives, vectors, geometry of space", tags: ["in-person", "online"] },
      { code: "SCH4U", name: "Chemistry", description: "Organic chemistry, structure, energy changes, equilibrium, electrochemistry", tags: ["in-person", "online"] },
      { code: "SBI4U", name: "Biology", description: "Biochemistry, metabolic processes, molecular genetics, homeostasis", tags: ["in-person", "online"] },
      { code: "SPH4U", name: "Physics", description: "Dynamics, energy, gravitational/electric/magnetic fields, electromagnetic radiation, quantum mechanics", tags: ["in-person", "online"] },
      { code: "CIA4U", name: "Analysing Current Economic Issues", description: "Macroeconomic theory, fiscal & monetary policy, globalization, current issues", tags: ["in-person", "online"] },
      { code: "BAT4M", name: "Financial Accounting Principles", description: "Corporate accounting, inventory & assets, financial analysis, decision-making", tags: ["in-person", "online"] },
      { code: "FSF4U", name: "French", description: "Reading, writing, speaking, and listening aligned with the Ontario curriculum. Taught exclusively by Murtadha.", tags: ["in-person", "online"] },
    ],
  },
];

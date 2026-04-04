export interface Testimonial {
  quote: string;
  studentName: string;
  school: string;
  grade: string;
  subject: string;
}

// Replace these with real testimonials as they come in.
// Set to empty array [] to hide the testimonials section entirely.
export const testimonials: Testimonial[] = [
  {
    quote: "I went from a 62 in Functions to an 84 on my exam. Fouad didn't just help me with the material — he taught me how to actually study for math.",
    studentName: "Priya R.",
    school: "Abbey Park High School",
    grade: "Grade 11",
    subject: "MCR3U — Functions",
  },
  {
    quote: "My son was dreading chemistry all semester. After 6 sessions with Meridian, he walked into his final feeling confident for the first time. Worth every dollar.",
    studentName: "Parent of Daniel K.",
    school: "Loyola CSS",
    grade: "Grade 12",
    subject: "SCH4U — Chemistry",
  },
];
// NOTE: These are placeholder testimonials for design purposes. Replace with real ones before launch.

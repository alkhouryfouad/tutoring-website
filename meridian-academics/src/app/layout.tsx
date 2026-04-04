import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Meridian Academics | Math & Science Tutoring in Oakville, ON",
  description:
    "Grade 9–12 math, chemistry, physics & biology tutoring in Oakville. In-person and online. Founded by a 97% student now at the University of Guelph. Book your free consultation.",
  openGraph: {
    title: "Meridian Academics | Oakville Tutoring",
    description: "Grade 9–12 tutoring by university students who aced these courses. Oakville's sharpest tutors.",
    locale: "en_CA",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="grain">
      <body>{children}</body>
    </html>
  );
}

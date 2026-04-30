export interface PricingTier {
  type: string;
  description: string;
  rates: { label: string; price: string }[];
  note?: string;
  featured?: boolean;
}

export const pricing: PricingTier[] = [
  {
    type: "1-on-1 Sessions",
    description: "Private tutoring, full attention on your student.",
    rates: [
      { label: "Grade 9–10", price: "$45/hr" },
      { label: "Grade 11", price: "$50/hr" },
      { label: "Grade 12", price: "$55/hr" },
    ],
    featured: true,
  },
  {
    type: "Pair Sessions (2 students)",
    description: "Bring a friend — each student pays less, same quality.",
    rates: [
      { label: "Grade 9–10", price: "$35/student/hr" },
      { label: "Grade 11", price: "$38/student/hr" },
      { label: "Grade 12", price: "$40/student/hr" },
    ],
  },
];

export const pricingNotes = [
  "First consultation is always free.",
  "No contracts. No commitments. Pay per session.",
  "Book 10 sessions, get your 11th free.",
  "Payment by e-transfer or cash. Online payment coming soon.",
];

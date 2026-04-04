interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

export default function SectionHeading({
  title,
  subtitle,
  align = "center",
}: SectionHeadingProps) {
  return (
    <div className={`mb-12 md:mb-16 ${align === "center" ? "text-center" : "text-left"}`}>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-charcoal-900 tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-lg text-charcoal-700 max-w-2xl leading-relaxed ${align === "center" ? "mx-auto" : ""}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

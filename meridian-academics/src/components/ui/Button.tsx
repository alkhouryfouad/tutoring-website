"use client";

import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  href?: string;
}

const base =
  "inline-flex items-center justify-center rounded-lg px-6 py-3 font-sans font-medium text-sm tracking-wide transition-all duration-200 cursor-pointer";

const variants: Record<Variant, string> = {
  primary: "bg-forest-600 text-white hover:bg-forest-500 active:bg-forest-700",
  secondary: "bg-amber-400 text-charcoal-900 hover:bg-amber-500 active:bg-amber-600",
  ghost:
    "border-2 border-forest-600 text-forest-600 hover:bg-forest-600 hover:text-white active:bg-forest-700",
};

export default function Button({
  variant = "primary",
  href,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

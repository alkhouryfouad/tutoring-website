"use client";

import { useState, useEffect } from "react";
import useScrollSpy from "@/hooks/useScrollSpy";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Subjects", href: "#subjects" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

const sectionIds = ["about", "subjects", "pricing", "faq", "contact"];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const activeId = useScrollSpy(sectionIds);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-cream-100/80 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16 md:h-20">
        <a href="#" className="font-serif font-semibold text-xl text-forest-600 tracking-tight">
          Meridian Academics
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors duration-200 ${
                activeId === link.href.slice(1)
                  ? "text-forest-600"
                  : "text-charcoal-700 hover:text-forest-600"
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className="ml-2 inline-flex items-center justify-center rounded-lg bg-forest-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-forest-500"
          >
            Book Free Consultation
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <span
            className={`block w-6 h-0.5 bg-charcoal-900 transition-all duration-300 ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-charcoal-900 transition-all duration-300 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-charcoal-900 transition-all duration-300 ${
              menuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-all duration-300 bg-cream-100/95 backdrop-blur-md ${
          menuOpen ? "max-h-96 border-b border-cream-300" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col px-6 py-4 gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`text-base font-medium transition-colors ${
                activeId === link.href.slice(1)
                  ? "text-forest-600"
                  : "text-charcoal-700"
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="mt-2 inline-flex items-center justify-center rounded-lg bg-forest-600 px-5 py-3 text-sm font-medium text-white"
          >
            Book Free Consultation
          </a>
        </nav>
      </div>
    </header>
  );
}

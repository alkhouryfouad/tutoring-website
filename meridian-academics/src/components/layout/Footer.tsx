const quickLinks = [
  { label: "About", href: "#about" },
  { label: "Subjects", href: "#subjects" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  return (
    <footer className="bg-forest-700 text-cream-200">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <p className="font-serif font-semibold text-xl text-white mb-3">
              Meridian Academics
            </p>
            <p className="text-cream-300 text-sm leading-relaxed">
              Grade 9–12 math and science tutoring in Oakville, Ontario.
              Founded by students, built for students.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <p className="font-semibold text-white text-sm uppercase tracking-wider mb-4">
              Quick Links
            </p>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-cream-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-semibold text-white text-sm uppercase tracking-wider mb-4">
              Get in Touch
            </p>
            <ul className="space-y-2 text-sm text-cream-300">
              <li>
                <a
                  href="mailto:hello@meridianaacademics.ca"
                  className="hover:text-white transition-colors"
                >
                  hello@meridianaacademics.ca
                </a>
              </li>
              <li>Oakville, Ontario</li>
              <li>
                <a
                  href="https://instagram.com/meridianaacademics"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  @meridianaacademics
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-forest-600">
          <p className="text-sm text-cream-300 text-center">
            &copy; 2026 Meridian Academics. Oakville, Ontario. ·{" "}
            <a href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </a>
          </p>
          <p className="mt-2 text-xs text-forest-400 text-center">
            Proudly serving students at Loyola CSS, Abbey Park HS, Iroquois Ridge HS, and across Oakville.
          </p>
        </div>
      </div>
    </footer>
  );
}

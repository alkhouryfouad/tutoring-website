import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy — Meridian Academics",
  description:
    "How Meridian Academics handles personal information collected through booking inquiries and messages.",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream-100 pt-28 pb-20">
        <article className="max-w-2xl mx-auto px-6">
          <header className="mb-10">
            <h1 className="font-serif font-semibold text-3xl md:text-4xl text-charcoal-900 mb-3">
              Privacy
            </h1>
            <p className="text-sm text-charcoal-700">
              Last updated: May 11, 2026
            </p>
          </header>

          <div className="bg-cream-50 border border-cream-300 rounded-2xl p-8 md:p-10 space-y-8 text-charcoal-900">
            <Section title="What we collect">
              <p>
                When you fill out the booking inquiry form or the quick-question form on this
                site, we collect the information you provide: parent/guardian name, parent/guardian
                email and phone number, the student&rsquo;s first name and grade, the subjects
                you&rsquo;re interested in, the format you prefer (in-person, online, or either),
                any preferred days or times, and any notes you add. The quick-question form
                only collects a name, an email, and a message.
              </p>
              <p>
                We don&rsquo;t use cookies for tracking, we don&rsquo;t run analytics, and we
                don&rsquo;t embed third-party trackers.
              </p>
            </Section>

            <Section title="Why we collect it">
              <p>
                We use this information for one purpose: to contact you about tutoring at
                Meridian Academics &mdash; scheduling a consultation, matching the right tutor,
                and following up on lessons.
              </p>
            </Section>

            <Section title="Who can see it">
              <p>
                Only the Meridian Academics team (Fouad, Murtadha, and Sarah). Submissions are
                stored in a private database that requires a password to access. We do not
                share, sell, or rent your information to anyone, and we do not use it for
                marketing or advertising.
              </p>
            </Section>

            <Section title="How long we keep it">
              <p>
                We keep inquiry records for as long as you&rsquo;re a Meridian Academics client
                plus a short period afterward, so we can answer follow-up questions. If you
                ask us to delete your data, we&rsquo;ll do so within a reasonable time.
              </p>
            </Section>

            <Section title="Your choices">
              <p>
                You can ask us at any time to:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-1">
                <li>See what we have on file for you</li>
                <li>Correct anything that&rsquo;s wrong</li>
                <li>Delete your records</li>
              </ul>
              <p>
                Just email us at{" "}
                <a
                  href="mailto:hello@meridianaacademics.ca"
                  className="text-forest-600 underline hover:text-forest-500"
                >
                  hello@meridianaacademics.ca
                </a>
                .
              </p>
            </Section>

            <Section title="Children">
              <p>
                Some of the people we tutor are minors. The contact forms are intended to be
                filled out by a parent or guardian. If you&rsquo;re a student under 18,
                please ask your parent or guardian to make the inquiry on your behalf.
              </p>
            </Section>

            <Section title="Updates to this notice">
              <p>
                If we change anything material about how we handle your information, we&rsquo;ll
                update this page and adjust the date at the top.
              </p>
            </Section>

            <Section title="Questions">
              <p>
                Reach out anytime at{" "}
                <a
                  href="mailto:hello@meridianaacademics.ca"
                  className="text-forest-600 underline hover:text-forest-500"
                >
                  hello@meridianaacademics.ca
                </a>
                .
              </p>
            </Section>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-serif font-semibold text-lg text-forest-700">{title}</h2>
      <div className="text-sm text-charcoal-900 leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

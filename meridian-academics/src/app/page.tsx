import Header from "@/components/layout/Header";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Team from "@/components/sections/Team";
import Subjects from "@/components/sections/Subjects";
import HowItWorks from "@/components/sections/HowItWorks";
import Pricing from "@/components/sections/Pricing";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact";
import ContactSimple from "@/components/sections/ContactSimple";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Team />
        <Subjects />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <FAQ />
        <ContactSimple />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

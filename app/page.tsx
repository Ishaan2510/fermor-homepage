import { CalculatorProvider } from "@/components/CalculatorContext";
import { ClosingCta, Footer } from "@/components/Closing";
import { Goals } from "@/components/Goals";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { MathSection } from "@/components/MathSection";
import { Principles } from "@/components/Principles";

export default function HomePage() {
  return (
    <CalculatorProvider>
      <a href="#calculator" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-card focus:p-3">
        Skip to calculator
      </a>
      <Header />
      <main>
        <Hero />
        <MathSection />
        <Goals />
        <Principles />
        <ClosingCta />
      </main>
      <Footer />
    </CalculatorProvider>
  );
}

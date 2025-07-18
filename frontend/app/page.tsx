import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import HowItWorksSection from "./components/HowItWorksSection";
import TestimonialsSection from "./components/TestimonialsSection";
import FinalCTASection from "./components/FinalCTASection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FinalCTASection />
      <Footer />
    </main>
  );
}

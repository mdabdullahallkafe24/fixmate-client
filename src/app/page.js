
import HeroSection from "@/components/home/hero-section";
import ServiceCategories from "@/components/home/service-categories";
import HowItWorks from "@/components/home/how-it-works";
import WhyChooseUs from "@/components/home/why-choose-us";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ServiceCategories />
      <HowItWorks />
      <WhyChooseUs />
    </main>
  );
}

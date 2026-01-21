import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TrustSection from "@/components/TrustSection";
import ServicesSection from "@/components/ServicesSection";
import CTASection from "@/components/CTASection";
import ContactSection from "@/components/ContactSection";
import MapSection from "@/components/MapSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <TrustSection />
        <ServicesSection />
        <CTASection />
        <ContactSection />
        <MapSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

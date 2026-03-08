import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/landing/Hero";
import StatsBar from "@/components/landing/StatsBar";
import HowItWorks from "@/components/landing/HowItWorks";
import IntegrationCode from "@/components/landing/IntegrationCode";
import LiveDemo from "@/components/landing/LiveDemo";

const Index = () => {
  return (
    <div className="min-h-screen bg-zk-base">
      <Navbar />
      <Hero />
      <StatsBar />
      <HowItWorks />
      <IntegrationCode />
      <LiveDemo />
      <Footer />
    </div>
  );
};

export default Index;

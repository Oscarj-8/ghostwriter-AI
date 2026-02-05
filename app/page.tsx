import Footer from "@/components/footer";
import LiveContainer from "@/components/live-container";
import Features from "@/components/features";
import HeroSection from "@/components/hero-section";

export default async function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30 font-sans">
      <HeroSection />
      <Features />
      <LiveContainer />
      <Footer />
    </div>
  );
}

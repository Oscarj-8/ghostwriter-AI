import Footer from "@/components/footer";
import LiveContainer from "@/components/live-container";
import Features from "@/components/features";
import HeroSection from "@/components/hero-section";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";

export default async function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30 font-sans">
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className={cn(
          "mask-[radial-gradient(700px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-20%] top-[2%] skew-y-12",
        )}
      />
      <div className="relative max-w-6xl mx-auto">
      <HeroSection />
      </div>
      <Features />
      <LiveContainer />
      <Footer />
    </div>
  );
}

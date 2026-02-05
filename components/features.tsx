import React from "react";
import { BrainCircuit, Zap, ShieldCheck } from "lucide-react";

interface FeaturesProps {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  border: string;
}

const FEATURES: FeaturesProps[] = [
  {
    title: "Market Intelligence",
    description:
      "Gemini-1.5-flash analyzes news to identify buyer and seller signals.",
    icon: BrainCircuit,
    color: "text-purple-500",
    border: "hover:border-purple-500/50",
  },
  {
    title: "Autonomous Outreach",
    description:
      "High-confidence leads are engaged via Resend without manual oversight.",
    icon: Zap,
    color: "text-blue-500",
    border: "hover:border-blue-500/50",
  },
  {
    title: "Secure Auth & RLS",
    description:
      "Your contact lists are protected by enterprise-grade Row Level Security.",
    icon: ShieldCheck,
    color: "text-green-500",
    border: "hover:border-green-500/50",
  },
];

const Features = () => {
  return (
    <section className="max-w-6xl relative mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-clip">
      {FEATURES.map((feature, idx) => (
        <div
          key={idx}
          className={`p-8 rounded-2xl relative border border-white/5 bg-neutral-900/50 backdrop-blur-sm transition-all duration-300 ${feature.border} group`}
        >
          <feature.icon
            className={`absolute opacity-5 group-hover:opacity-15 right-1 bottom-1 w-24 h-24 ${feature.color} z-0 pointer-events-none group-hover:scale-110 transition-transform duration-300 ease-in-out`}
          />
          <h3 className="text-xl z-50 font-bold mb-2">{feature.title}</h3>
          <p className="text-neutral-500 z-50 text-sm leading-relaxed">
            {feature.description}
          </p>
        </div>
      ))}
    </section>
  );
};

export default Features;

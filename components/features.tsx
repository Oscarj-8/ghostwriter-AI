import React from "react";
import {
  BrainCircuit,
  Zap,
  ShieldCheck,
} from "lucide-react";

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
    <section className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      {FEATURES.map((feature, idx) => (
        <div
          key={idx}
          className={`p-8 rounded-2xl border border-white/5 bg-neutral-900/50 backdrop-blur-sm transition-all duration-300 ${feature.border} group`}
        >
          <feature.icon
            className={`w-10 h-10 ${feature.color} mb-6 group-hover:scale-110 transition-transform`}
          />
          <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
          <p className="text-neutral-500 text-sm leading-relaxed">
            {feature.description}
          </p>
        </div>
      ))}
    </section>
  );
};

export default Features;

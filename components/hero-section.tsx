import React from "react";
import AuthButton from "./auth-button";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";

const HeroSection = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <section className="relative pt-32 pb-20 px-6 text-center overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-125 bg-purple-600/10 blur-[120px] rounded-full -z-10" />

      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 mb-6">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
        </span>
        Autonomous Agent Now Live
      </div>
      <div className="relative max-w-2xl mx-auto">
        <h1 className="text-5xl z-50 relative md:text-8xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-linear-to-b from-white to-neutral-500">
          GHOSTWRITER
        </h1>
        <Image
          alt="logo"
          src="/images/logo2.png"
          width={200}
          height={200}
          className="inline-block z-0 absolute top-0 -right-32 rotate-12 opacity-8npm 0 pointer-events-none"
        />
      </div>

      <p className="text-neutral-400 max-w-xl mx-auto text-lg md:text-xl mb-10 leading-relaxed">
        The autonomous real estate strategist that turns market volatility into
        personalized opportunities.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <AuthButton user={user} />
      </div>
    </section>
  );
};

export default HeroSection;

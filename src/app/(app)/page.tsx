'use client'
import HeroSection from "@/components/Landing/HeroSection";
import { StatsSection, FeaturesSection, CTASection, LandingFooter } from "@/components/Landing/LandingSections";
import ViewsSection from "@/components/Landing/ViewsSection";
import dynamic from "next/dynamic";

const LandingNav = dynamic(() => import("@/components/Landing/LandingNav"), { ssr: false });

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <LandingNav />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <ViewsSection />
      <CTASection />
      <LandingFooter />
    </div>
  );
}

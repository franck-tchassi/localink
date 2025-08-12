// app/[locale]/(landing)/page.tsx
import PartnersSection from "./sections/PartnersSection";
import { AnimatedTestimonialsDemo } from "./sections/AnimatedTestimonialsDemo";
import PresentationYoutube from "@/components/layout/PresentationYoutube";
import CallToAction from "@/components/layout/CallToAction";
import Hero from "@/components/layout/Hero";
import AdvantagesSection from "./sections/AdvantagesSection"; // Ne contient plus de logique serveur
import { getCurrentSession } from "@/actions/auth";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const session = await getCurrentSession();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <AdvantagesSection />
      <PartnersSection />
      <AnimatedTestimonialsDemo />
      <PresentationYoutube />
      <CallToAction />
    </div>
  );
}

import CtaSection from "@/Components/CTA";
import Footer from "@/Components/Footer";
import Navbar from "@/Components/Navbar";
import Hero from "@/Components/Hero";
import Features from "@/Components/Features";
import DashboardPreview from "@/Components/DashboardPreview";
import { TrustedBy } from "@/Components/TrustedBy";
import MeetOrion from "@/Components/MeetOrion";
import MarketingFeatureBands from "@/Components/MarketingFeatureBands";

export default function Landing() {
  return (
    <>
      <div className="min-h-screen w-full flex flex-col bg-background text-foreground overflow-x-hidden">
        <Navbar />
        <Hero />
        <TrustedBy />
        <MeetOrion />
        <MarketingFeatureBands />
        <Features />
        <DashboardPreview />

        <CtaSection />
        <Footer />
      </div>
    </>
  );
}

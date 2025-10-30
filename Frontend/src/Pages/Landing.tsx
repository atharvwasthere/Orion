import CtaSection from "@/Components/CTA";
import Footer from "@/Components/Footer";
import Navbar from "@/Components/Navbar";
import Hero from "@/Components/Hero";
import Features from "@/Components/Features";
import DashboardPreview from "@/Components/DashboardPreview";
import { TrustedBy } from "@/Components/TrustedBy";
import MeetOrion from "@/Components/MeetOrion";
import MarketingFeatureBands from "@/Components/MarketingFeatureBands";
import DashboardSetup from "@/Components/images/dashboard-setup.png";

export default function Landing() {
  return (
    <>
      <div className="min-h-screen w-full flex flex-col bg-background text-foreground overflow-x-hidden">
        <Navbar />
        <Hero />
        <div className="flex items-center justify-center min-h-screen">
          <div className="p-8 shadow-2xl rounded-2xl w-6xl text-shadow-yellow-400 ">
            <img src={DashboardSetup} alt="Dashboard Setup" />
          </div>
        </div>
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

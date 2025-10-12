import CtaSection from "@/Components/CTA";
import Footer from "@/Components/Footer";
import Navbar from "@/Components/Navbar";
import Hero from "@/Components/Hero";
import Features from "@/Components/Features";
import DashboardPreview from "@/Components/DashboardPreview";
import { TrustedBy } from "@/Components/TrustedBy";
import MeetOrion from "@/Components/MeetOrion";

export default function Landing() {
  return (
    <>
      <div className="min-h-screen min-w-full bg-background text-foreground">
        <Navbar />
        <Hero />
        <TrustedBy />
        <MeetOrion />
        <Features />
        <DashboardPreview />

        <CtaSection />
        <Footer />
      </div>
    </>
  );
}

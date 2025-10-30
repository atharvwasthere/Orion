import man from "@/Components/logo/man.svg";
import { Link } from "@tanstack/react-router";

function CtaSection() {
  return (
    <section className="relative flex flex-col items-center justify-center py-32 bg-gradient-to-b from-background via-background/80 to-muted/30 overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {/* Foreground content */}
      <div className="relative z-10 mx-auto px-6 text-center">
        <div className="animate-wiggle-lines mb-10 flex justify-center ">
            <img
              src={man}
              
              alt="Orion mascot"
              className="w-24 scale-200 h-24 object-contain drop-shadow-lg "
            />
        </div>

        {/* Heading */}
        <h2 className="font-display text-5xl md:text-6xl font-bold mb-4 tracking-tight">
          Ready to begin?
        </h2>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Join the waitlist and be among the first to experience
          <span className="text-primary font-medium"> AI-powered support automation</span> with Orion.
        </p>

        {/* CTA Button */}
        <Link
          to="/dashboard/setup"
          className="text-lg px-10 py-6 rounded-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/30 hover:scale-105 transition-transform"
        >
          Get early access
        </Link>
      </div>
    </section>
  );
}

export default CtaSection;

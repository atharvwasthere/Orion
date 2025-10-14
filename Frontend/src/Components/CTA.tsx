import { Button } from "@/Components/ui/button";

function CtaSection() {
  return (
    <>
      <section className="py-32 bg-background relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]">
            <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />
          </div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-8 flex justify-center">
              <div className="w-20 h-20 relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                <div className="relative w-full h-full bg-primary rounded-full flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10">
                    <path
                      d="M5 12L10 17L20 7"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <h2 className="font-display text-5xl md:text-6xl font-bold mb-6 text-balance">
              Ready to begin?
            </h2>
            <p className="text-xl text-muted-foreground mb-10 text-pretty leading-relaxed">
              Join the waitlist and be among the first to experience AI-powered
              support automation with Orion.
            </p>

            <Button
              size="lg"
              className="text-lg px-12 py-7 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all"
            >
              Get early access
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

export default CtaSection;

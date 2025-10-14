import { Button } from "@/Components/ui/button";
import HeroSVG from "@/Components/logo/animated-figure";

function Hero() {
  return (
    <>
      <div className="flex flex-col space-y-12 items-center">
        <section className="relative flex w-full flex-col justify-start p-4 mt-12 sm:mt-24">
          {/* <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" /> */}

          <div className="flex flex-col text-center space-y-12 items-center">
            <div className="max-w-6xl mx-auto text-center py-12 ">
              <h1 className="font-extrabold tracking-tightest sm:tracking-tighter text-[48px] sm:text-[120px] leading-[42px] sm:leading-[105px] max-w-4xl font-extrablack uppercase space-x-2">
                <span
                  className="space-x-1"
                >
                  <span >
                    R
                  </span>
                  <span >
                    u
                  </span>
                  <span >
                    n
                  </span>{" "}
                </span>
                <span
                  className="space-x-1"
                >
                  <span >
                    o
                  </span>
                  <span >
                    n
                  </span>{" "}
                </span>
                <span
                  className="space-x-1"
                >
                  <span >
                    a
                  </span>
                  <span >
                    u
                  </span>
                  <span >
                    t
                  </span>
                  <span >
                    o
                  </span>
                  <span >
                    p
                  </span>
                  <span >
                    i
                  </span>
                  <span >
                    l
                  </span>
                  <span >
                    o
                  </span>
                  <span>
                    t
                  </span>
                </span>
              </h1>
<HeroSVG
  className=" hover:animate-wiggle-lines text-primary absolute h-[280px] sm:h-[480px] top-[-40px] sm:top-[-100px] left-[60%] sm:left-[55%] -translate-x-1/2"
  aria-hidden="true"
/>

              <h3 className="mt-12 text-2xl sm:text-2xl font-display  max-w-3xl mx-auto text-center leading-relaxed">
                Powerful software that works so you don't have to
              </h3>

              <div className="flex justify-center gap-2 mt-8">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base px-8 py-6 rounded-xs  bg-transparent"
                >
                  Join waitlist
                </Button>
                <Button
                  size="lg"
                  className="text-base px-8 py-6 rounded-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
                >
                  Get access now
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Hero;

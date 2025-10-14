import { ScrollTriggeredLoader } from "./MultiLadderProcess"

function MeetOrion() {
  return (
    <>
     {/* Meet Orion Section */}
            <section className="pt-24 bg-primary text-primary-foreground relative overflow-hidden rounded-sm">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent rounded-full blur-3xl" />
              </div>
    
              <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                  <p className="text-[24px] font-medium uppercase tracking-wider mb-4 text-primary-foreground/80">
                    Meet Orion
                  </p>
                  <h2 className="font-display text-5xl md:text-6xl font-bold mb-6 text-balance">
                    Your AI support partner that works while you sleep.
                  </h2>
                </div>
                <ScrollTriggeredLoader />
              </div>
    
            </section>
    </>
  )
}

export default MeetOrion
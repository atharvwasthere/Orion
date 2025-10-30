import Dashboard from "@/Components/images/Dashboard.png";

function DashboardPreview() {
  return (
    <>
      {/* Dashboard Preview Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-display text-5xl md:text-6xl font-bold mb-6 text-balance">
                Manage tickets, summarize chats, and stay in control
              </h2>
              <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
                Your command center for AI-powered support automation
              </p>
            </div>
            <div className="flex items-center justify-center min-h-screen">
              <div className="shadow-2xs rounded-2xl w-6xl \">
                <img src={Dashboard} alt="Dashboard Setup" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default DashboardPreview;

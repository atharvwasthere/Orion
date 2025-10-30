import { OrionLogo } from "@/Components/logo/orion-logo";
import { SystemOnlineBadge } from "@/Components/SystemOnlineBadge";

function Footer() {
  return (
    <footer className="w-screen bg-foreground text-background py-16 ">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
            <OrionLogo className="text-background" />

            <div className="flex flex-col md:flex-row items-center gap-6">
              <SystemOnlineBadge />
            </div>
          </div>

          <div className="border-t border-background/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/70">
            <p>© 2025 Orion AI. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-background transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-background transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-background transition-colors">
                Cookie Preferences
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

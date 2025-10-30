import { Button } from "@/Components/ui/button";
import OrionLogo from "/logo.png";
import { Link } from "@tanstack/react-router";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center">
      <nav className="mt-2 flex h-12 md:h-14 w-full max-w-7xl items-center justify-between rounded-lg  backdrop-blur-md px-4 transition-all">
        {/* Left Section: Logo + Links */}
        <div className="flex items-center gap-8 ">
          <img src={OrionLogo} alt="Orion Logo" className="w-8 h-8 -mt-2" />
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a
              href="/demo"
              className="hover:text-primary transition-colors"
            >
              Demo
            </a>
            <a href="/about" className="hover:text-primary transition-colors">
              About
            </a>
          </div>
        </div>

        {/* Right Section: Buttons */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="border-none shadow-none bg-transparent hover:bg-transparent font-medium rounded-none"
          >
            Login
          </Button>
          <Button
            
            size="sm"
            className="bg-primary hover:bg-primary/90 text-md text-primary-foreground font-medium rounded-none"
          >
            <Link to="/dashboard/setup">Get Access Now</Link>{" "}
          </Button>
        </div>
      </nav>
    </header>
  );
}

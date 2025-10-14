import { Link } from "@tanstack/react-router"
import { Moon, Sun } from "lucide-react"
// import { useTheme } from "next-themes"
import { Button } from "@/Components/ui/button"
import { OrionLogo } from "@/Components/logo/orion-logo"

export function DemoNav() {
//   const { theme, setTheme } = useTheme()

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-8 py-4">
        <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <OrionLogo className="h-8 w-8" />
          <span className="font-display text-xl font-bold text-foreground"></span>
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="sm">
              Back to Home
            </Button>
          </Link>
          <Button
            variant="outline"
            size="icon"
            // onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </nav>
  )
}

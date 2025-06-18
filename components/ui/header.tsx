import Link from "next/link";
import { Github } from "lucide-react";
import { ModeToggle } from "../mode-toggle";
import { Button } from "./button";

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight hover:text-primary transition-colors"
        >
          utilities.dev
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="https://github.com/Basedash/utilities.dev"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source on GitHub"
          >
            <Button variant="ghost" size="icon">
              <Github className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </Link>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}

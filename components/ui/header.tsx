import Link from "next/link";
import { Github } from "lucide-react";

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

        <Link
          href="https://github.com/Basedash/utilities.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="View source on GitHub"
        >
          <Github className="h-5 w-5" />
        </Link>
      </div>
    </header>
  );
}

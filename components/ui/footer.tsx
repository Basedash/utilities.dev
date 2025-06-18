export function Footer() {
  return (
    <footer className="border-t mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-sm text-muted-foreground">
          <p>utilities.dev - A collection of essential developer tools</p>
          <p className="mt-2">
            Made by the team at{" "}
            <a
              href="https://www.basedash.com?ref=utilities.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              Basedash
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

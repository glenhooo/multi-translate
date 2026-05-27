export function FooterSection() {
  return (
    <footer className="mt-auto w-full border-t border-border bg-background text-sm">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-4 px-4 py-4 md:flex-row md:justify-between md:px-10">
        <span className="text-xs font-medium text-muted-foreground">
          &copy; 2026 MultiTranslate. All rights reserved.
        </span>
        <nav className="flex gap-4">
          <a
            href="#"
            className="text-muted-foreground transition-colors hover:text-primary hover:underline"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-muted-foreground transition-colors hover:text-primary hover:underline"
          >
            Terms of Service
          </a>
        </nav>
      </div>
    </footer>
  );
}

import { Languages } from "lucide-react"

import { handleRouteLinkClick } from "@/lib/navigation"

export function SettingsTopNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:px-10">
        <a
          href="/"
          className="flex items-center gap-2 text-lg font-semibold transition-colors hover:text-primary"
          onClick={(event) => handleRouteLinkClick(event, "/")}
        >
          <Languages className="size-6 text-primary" />
          <span>MultiTranslate</span>
        </a>

        <nav className="hidden items-center gap-4 md:flex" aria-label="主导航">
          <a
            href="/settings"
            aria-current="page"
            className="border-b-2 border-primary pb-1 text-sm font-semibold text-primary transition-colors hover:text-primary"
            onClick={(event) => handleRouteLinkClick(event, "/settings")}
          >
            Settings
          </a>
        </nav>
      </div>
    </header>
  )
}

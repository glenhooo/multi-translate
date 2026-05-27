import { Languages, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { handleRouteLinkClick } from "@/lib/navigation";

export function TopNavBar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:px-10">
        {/* Left: Brand */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Languages className="size-6 text-primary" />
            <span>MultiTranslate</span>
          </div>
        </div>

        {/* Right: Settings button */}
        <Button variant="link" size="sm" className="gap-2" asChild>
          <a
            href="/settings"
            onClick={(event) => handleRouteLinkClick(event, "/settings")}
          >
            <Settings className="size-[18px]" />
          </a>
        </Button>
      </div>
    </header>
  );
}

import { Settings } from "lucide-react"

import { handleRouteLinkClick } from "@/lib/navigation"
import { cn } from "@/lib/utils"

const bottomNavItems = [
  {
    label: "Settings",
    href: "/settings",
    route: "/settings",
    icon: Settings,
    active: true,
  },
]

export function SettingsBottomNav() {
  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 border-t border-border bg-background px-2 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] md:hidden">
      <ul className="flex h-14 items-center justify-around">
        {bottomNavItems.map((item) => {
          const Icon = item.icon

          return (
            <li key={item.label} className="flex-1">
              <a
                href={item.href}
                aria-current={item.active ? "page" : undefined}
                className={cn(
                  "flex h-full w-full flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
                  item.active
                    ? "font-bold text-primary"
                    : "text-muted-foreground hover:text-primary"
                )}
                onClick={
                  item.route
                    ? (event) => handleRouteLinkClick(event, item.route)
                    : undefined
                }
              >
                {item.active ? (
                  <span className="rounded-full bg-primary/10 px-4 py-0.5 text-primary">
                    <Icon className="size-5" />
                  </span>
                ) : (
                  <Icon className="size-5" />
                )}
                <span>{item.label}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

import { History, Server, SlidersHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"

const sidebarItems = [
  {
    label: "提供商管理",
    href: "#providers",
    icon: Server,
    active: true,
  },
  {
    label: "通用设置",
    href: "#general",
    icon: SlidersHorizontal,
    active: false,
  },
  {
    label: "配置管理",
    href: "#administration",
    icon: History,
    active: false,
  },
]

export function SettingsSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 md:block">
      <h2 className="mb-4 text-xl font-semibold">配置</h2>
      <nav className="flex flex-col gap-2" aria-label="设置导航">
        {sidebarItems.map((item) => {
          const Icon = item.icon

          return (
            <a
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                item.active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </a>
          )
        })}
      </nav>
    </aside>
  )
}

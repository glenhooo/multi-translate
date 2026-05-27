import * as React from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

type DialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  icon?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
}

export function Dialog({
  open,
  onOpenChange,
  title,
  icon,
  children,
  footer,
}: DialogProps) {
  const dialogRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!open) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, onOpenChange])

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs"
        onClick={() => onOpenChange(false)}
      />

      {/* Dialog panel */}
      <div
        ref={dialogRef}
        className={cn(
          "relative z-10 mx-4 w-full max-w-lg animate-in fade-in zoom-in-95",
          "rounded-xl border border-border bg-card p-0 shadow-2xl"
        )}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              {icon && <span className="text-muted-foreground">{icon}</span>}
              {title}
            </div>
            <button
              type="button"
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              onClick={() => onOpenChange(false)}
              aria-label="关闭"
            >
              <X className="size-4" />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-4 text-sm text-foreground">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}
import { ArrowLeftRight } from "lucide-react"

interface SwapButtonProps {
  orientation?: "horizontal" | "vertical"
  disabled?: boolean
  onClick?: () => void
}

export function SwapButton({
  orientation = "horizontal",
  disabled = false,
  onClick,
}: SwapButtonProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="flex items-center justify-center rounded-full border border-border bg-card p-2 text-muted-foreground shadow-xs transition-all hover:bg-muted hover:text-primary disabled:pointer-events-none disabled:opacity-40"
    >
      <ArrowLeftRight
        className={`size-[20px] ${orientation === "vertical" ? "rotate-90" : ""}`}
      />
    </button>
  )
}
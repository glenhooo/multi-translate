import { cn } from "@/lib/utils"

type ProviderEnabledSwitchProps = {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label?: string
}

export function ProviderEnabledSwitch({
  checked,
  onCheckedChange,
  label = "切换提供商启用状态",
}: ProviderEnabledSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 border-transparent transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        checked ? "bg-primary" : "bg-muted"
      )}
      onClick={() => onCheckedChange(!checked)}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none block size-4 rounded-full bg-background shadow-sm ring-0 transition-transform",
          checked ? "translate-x-4" : "translate-x-0"
        )}
      />
    </button>
  )
}

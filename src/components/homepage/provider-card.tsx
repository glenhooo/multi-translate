import { useState } from "react"
import { Check, Copy, Loader2, RefreshCw, Volume2 } from "lucide-react"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { TranslationState } from "./translation-workbench"

interface ProviderCardProps {
  name: string
  modelId?: string
  state: TranslationState
  onRetry: () => void
}

export function ProviderCard({ name, modelId, state, onRetry }: ProviderCardProps) {
  const [copied, setCopied] = useState(false)
  const [copiedLower, setCopiedLower] = useState(false)

  const handleCopy = async () => {
    if (!state.text) return
    await navigator.clipboard.writeText(state.text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const handleCopyLowercase = async () => {
    if (!state.text) return
    await navigator.clipboard.writeText(state.text.toLowerCase())
    setCopiedLower(true)
    setTimeout(() => setCopiedLower(false), 1500)
  }
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-primary">{name}</span>
          {modelId && (
            <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">{modelId}</span>
          )}
        </div>
        {state.status === "streaming" && (
          <Loader2 className="size-4 animate-spin text-muted-foreground" />
        )}
      </div>

      <div className="min-h-[100px] text-base text-foreground">
        {state.status === "idle" && (
          <p className="italic text-muted-foreground/60">等待翻译...</p>
        )}
        {(state.status === "streaming" || state.status === "done") && (
          <p className="whitespace-pre-wrap leading-relaxed">
            {state.text}
            {state.status === "streaming" && (
              <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-primary" />
            )}
          </p>
        )}
        {state.status === "error" && (
          <p className="text-sm text-destructive">{state.error}</p>
        )}
      </div>

      <div className="mt-2 flex justify-end gap-1 border-t border-border/30 pt-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-primary disabled:opacity-50"
              disabled={state.status === "streaming"}
              onClick={onRetry}
            >
              <RefreshCw className={`size-[18px] ${state.status === "streaming" ? "animate-spin" : ""}`} />
            </button>
          </TooltipTrigger>
          <TooltipContent>重试</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-primary disabled:opacity-50"
              disabled={!state.text}
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="size-[18px] text-green-500" />
              ) : (
                <Copy className="size-[18px]" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent>复制</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="rounded-full p-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-primary disabled:opacity-50"
              disabled={!state.text}
              onClick={handleCopyLowercase}
            >
              {copiedLower ? (
                <Check className="size-[18px] text-green-500" />
              ) : (
                <span className="font-mono text-[11px]">ab</span>
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent>复制为全小写</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
            >
              <Volume2 className="size-[18px]" />
            </button>
          </TooltipTrigger>
          <TooltipContent>朗读</TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}

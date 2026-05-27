import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { TranslationProviderConfig } from "@/lib/settings-storage"
import type { ProviderTestResult } from "@/lib/translate-api"

import { ProviderConfigCard } from "./provider-config-card"

type TestState =
  | { providerId: string; loading: true; result: null }
  | { providerId: string; loading: false; result: ProviderTestResult }
  | null

type ProviderManagementProps = {
  providers: TranslationProviderConfig[]
  testState: TestState
  onAddProvider: () => void
  onProviderChange: (provider: TranslationProviderConfig) => void
  onSaveSettings: () => void
  onTestProvider: (provider: TranslationProviderConfig) => void
  onDismissTestResult: () => void
}

export function ProviderManagement({
  providers,
  testState,
  onAddProvider,
  onProviderChange,
  onSaveSettings,
  onTestProvider,
  onDismissTestResult,
}: ProviderManagementProps) {
  return (
    <section id="providers" className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 border-b border-border pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-xl">
            提供商 (Providers)
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            配置您的翻译 API 服务提供商。
          </p>
        </div>
        <Button
          type="button"
          size="lg"
          className="gap-2 sm:self-start"
          onClick={onAddProvider}
        >
          <Plus className="size-4" />
          添加提供商
        </Button>
      </div>

      {providers.map((provider) => (
        <ProviderConfigCard
          key={provider.id}
          provider={provider}
          isTesting={
            testState?.providerId === provider.id && testState.loading
          }
          testResult={
            testState?.providerId === provider.id && !testState.loading
              ? testState.result
              : null
          }
          onChange={onProviderChange}
          onSave={onSaveSettings}
          onTest={() => onTestProvider(provider)}
          onDismissTestResult={onDismissTestResult}
        />
      ))}

      <button
        type="button"
        className="flex min-h-36 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-card/50 p-6 text-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        onClick={onAddProvider}
      >
        <span className="flex size-12 items-center justify-center rounded-full bg-muted">
          <Plus className="size-5" />
        </span>
        <span className="text-sm font-medium">
          添加更多提供商以支持多平台翻译路由。
        </span>
      </button>
    </section>
  )
}
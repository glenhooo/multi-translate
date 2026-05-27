import * as React from "react"
import { toast } from "sonner"

import { FooterSection } from "@/components/homepage/footer-section"
import {
  createProvider,
  loadSettingsFromStorage,
  parseSettingsJson,
  saveSettingsToStorage,
  serializeSettings,
  type GeneralSettings,
  type MultiTranslateSettings,
  type TranslationProviderConfig,
} from "@/lib/settings-storage"
import {
  checkProviderConnection,
  type ProviderTestResult,
} from "@/lib/translate-api"

import { ConfigurationAdmin } from "./configuration-admin"
import { GeneralSettingsSection } from "./general-settings"
import { ProviderManagement } from "./provider-management"
import { SettingsBottomNav } from "./settings-bottom-nav"
import { SettingsSidebar } from "./settings-sidebar"
import { SettingsTopNav } from "./settings-top-nav"

function downloadJsonFile(filename: string, json: string) {
  const blob = new Blob([json], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")

  link.href = url
  link.download = filename
  document.body.append(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

type TestState =
  | { providerId: string; loading: true; result: null }
  | { providerId: string; loading: false; result: ProviderTestResult }
  | null

export function SettingsPage() {
  const [settings, setSettings] = React.useState<MultiTranslateSettings>(() =>
    loadSettingsFromStorage()
  )
  const [testState, setTestState] = React.useState<TestState>(null)

  const handleProviderChange = React.useCallback(
    (updatedProvider: TranslationProviderConfig) => {
      setSettings((currentSettings) => ({
        ...currentSettings,
        providers: currentSettings.providers.map((provider) =>
          provider.id === updatedProvider.id ? updatedProvider : provider
        ),
      }))
    },
    []
  )

  const handleAddProvider = React.useCallback(() => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      providers: [
        ...currentSettings.providers,
        createProvider({
          name: `OpenAI Provider ${currentSettings.providers.length + 1}`,
        }),
      ],
    }))
    toast.info("已添加新的 OpenAI-compatible 提供商。")
  }, [])

  const handleGeneralChange = React.useCallback(
    (general: GeneralSettings) => {
      setSettings((currentSettings) => ({
        ...currentSettings,
        general,
      }))
    },
    []
  )

  const handleSaveSettings = React.useCallback(() => {
    setSettings((currentSettings) => saveSettingsToStorage(currentSettings))
    toast.success("配置已保存到本地浏览器。")
  }, [])

  const handleTestProvider = React.useCallback(
    async (provider: TranslationProviderConfig) => {
      if (!provider.apiBaseUrl) {
        toast.error("请先填写 API Base URL")
        return
      }
      if (!provider.apiKey) {
        toast.error("请先填写 API Key")
        return
      }

      setTestState({ providerId: provider.id, loading: true, result: null })

      const result = await checkProviderConnection(provider)

      setTestState({ providerId: provider.id, loading: false, result })
    },
    []
  )

  const handleDismissTestResult = React.useCallback(() => {
    setTestState(null)
  }, [])

  const handleExport = React.useCallback(() => {
    downloadJsonFile(
      "multi-translate-settings.json",
      serializeSettings(settings)
    )
    toast.success("配置 JSON 已在浏览器中生成并导出。")
  }, [settings])

  const handleImportFile = React.useCallback(
    async (file: File) => {
      try {
        const importedSettings = parseSettingsJson(await file.text())
        const savedSettings = saveSettingsToStorage(importedSettings)

        setSettings(savedSettings)
        toast.success("配置已导入并保存到本地浏览器。")
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "无法读取配置文件。"

        toast.error(`导入失败：${message}`)
      }
    },
    []
  )

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SettingsTopNav />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 pb-28 md:flex-row md:gap-8 md:px-10 md:py-8 md:pb-8">
        <div className="md:hidden">
          <h1 className="text-3xl font-semibold tracking-tight">
            Configuration
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your translation providers and application preferences.
          </p>
        </div>

        <SettingsSidebar />

        <div className="flex min-w-0 flex-1 flex-col gap-8">
          <ProviderManagement
            providers={settings.providers}
            testState={testState}
            onAddProvider={handleAddProvider}
            onProviderChange={handleProviderChange}
            onSaveSettings={handleSaveSettings}
            onTestProvider={handleTestProvider}
            onDismissTestResult={handleDismissTestResult}
          />

          <GeneralSettingsSection
            general={settings.general}
            onChange={handleGeneralChange}
            onSave={handleSaveSettings}
          />

          <ConfigurationAdmin
            onExport={handleExport}
            onImportFile={handleImportFile}
          />
        </div>
      </main>
      <div className="hidden md:block">
        <FooterSection />
      </div>
      <SettingsBottomNav />
    </div>
  )
}

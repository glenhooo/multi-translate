import * as React from "react";
import { Bot, Cable, Check, Eye, EyeOff, Loader2, Save, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import type { TranslationProviderConfig } from "@/lib/settings-storage";
import type { ProviderTestResult } from "@/lib/translate-api";

import { ProviderEnabledSwitch } from "./provider-enabled-switch";

type ProviderConfigCardProps = {
  provider: TranslationProviderConfig;
  isTesting: boolean;
  testResult: ProviderTestResult | null;
  onChange: (provider: TranslationProviderConfig) => void;
  onSave: () => void;
  onTest: () => void;
  onDismissTestResult: () => void;
};

const inputClassName =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-60";

function parseModelsInput(value: string) {
  return value
    .split(",")
    .map((model) => model.trim())
    .filter(Boolean);
}

export function ProviderConfigCard({
  provider,
  isTesting,
  testResult,
  onChange,
  onSave,
  onTest,
  onDismissTestResult,
}: ProviderConfigCardProps) {
  const [showApiKey, setShowApiKey] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const nameId = `${provider.id}-name`;
  const typeId = `${provider.id}-type`;
  const apiBaseId = `${provider.id}-api-base`;
  const apiKeyId = `${provider.id}-api-key`;
  const modelsId = `${provider.id}-models`;

  // 自动弹出结果弹窗
  React.useEffect(() => {
    if (testResult) {
      setDialogOpen(true);
    }
  }, [testResult]);

  function handleDialogClose(open: boolean) {
    setDialogOpen(open);
    if (!open) {
      onDismissTestResult();
    }
  }

  function updateProvider(nextValues: Partial<TranslationProviderConfig>) {
    onChange({ ...provider, ...nextValues });
  }

  return (
    <article className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
      <div className="flex items-start justify-between gap-4 border-b border-border px-4 py-4 md:hidden">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Bot className="size-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">
              {provider.name || "OpenAI Provider"}
            </h4>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-primary">
              <span className="size-2 rounded-full bg-primary" />
              {provider.enabled ? "Active" : "Disabled"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4 md:p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-3">
              <label
                htmlFor={nameId}
                className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
              >
                名称
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  已启用
                </span>
                <ProviderEnabledSwitch
                  checked={provider.enabled}
                  onCheckedChange={(checked) =>
                    updateProvider({ enabled: checked })
                  }
                />
              </div>
            </div>
            <input
              id={nameId}
              className={inputClassName}
              value={provider.name}
              onChange={(event) => updateProvider({ name: event.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor={typeId}
              className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
            >
              类型
            </label>
            <select
              id={typeId}
              className={inputClassName}
              value={provider.type}
              disabled
              onChange={() => undefined}
            >
              <option value="openai-compatible">OpenAI Compatible</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={apiBaseId}
            className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
          >
            API Base
          </label>
          <input
            id={apiBaseId}
            type="url"
            className={inputClassName}
            placeholder="https://api.openai.com/v1"
            value={provider.apiBaseUrl}
            onChange={(event) =>
              updateProvider({ apiBaseUrl: event.target.value })
            }
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={apiKeyId}
            className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
          >
            API Key
          </label>
          <div className="relative">
            <input
              id={apiKeyId}
              type={showApiKey ? "text" : "password"}
              className={`${inputClassName} pr-10`}
              value={provider.apiKey}
              onChange={(event) =>
                updateProvider({ apiKey: event.target.value })
              }
            />
            <button
              type="button"
              aria-label={showApiKey ? "隐藏 API Key" : "显示 API Key"}
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              onClick={() => setShowApiKey((current) => !current)}
            >
              {showApiKey ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={modelsId}
            className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
          >
            模型 (Models)
          </label>
          <input
            id={modelsId}
            className={inputClassName}
            value={provider.models.join(", ")}
            onChange={(event) =>
              updateProvider({ models: parseModelsInput(event.target.value) })
            }
          />
          <p className="text-xs text-muted-foreground">
            使用逗号分隔多个模型名称，第一个模型将作为默认模型。
          </p>
        </div>

        <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="gap-2 sm:min-w-24"
            onClick={onTest}
            disabled={isTesting}
          >
            {isTesting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Cable className="size-4" />
            )}
            {isTesting ? "测试中..." : "测试"}
          </Button>
          <Button
            type="button"
            size="lg"
            className="gap-2 hover:bg-primary/90 sm:min-w-24"
            onClick={onSave}
          >
            <Save className="size-4" />
            保存
          </Button>
        </div>
      </div>

      {/* 测试结果弹窗 */}
      <Dialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        title={testResult?.success ? "连接测试成功" : "连接测试失败"}
        icon={
          testResult?.success ? (
            <Check className="size-5 text-emerald-500" />
          ) : (
            <X className="size-5 text-red-500" />
          )
        }
        footer={
          <Button
            variant="default"
            size="sm"
            onClick={() => handleDialogClose(false)}
          >
            我知道了
          </Button>
        }
      >
        {testResult && (
          <div className="flex flex-col gap-4">
            {/* 状态摘要 */}
            <div
              className={`flex items-center gap-3 rounded-lg border p-4 ${
                testResult.success
                  ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30"
                  : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30"
              }`}
            >
              {testResult.success ? (
                <div className="flex size-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
                  <Check className="size-5" />
                </div>
              ) : (
                <div className="flex size-10 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400">
                  <X className="size-5" />
                </div>
              )}
              <div>
                <p
                  className={`text-sm font-semibold ${
                    testResult.success
                      ? "text-emerald-800 dark:text-emerald-300"
                      : "text-red-800 dark:text-red-300"
                  }`}
                >
                  {testResult.success ? "连接成功" : "连接失败"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {provider.name} · {provider.apiBaseUrl}
                </p>
              </div>
            </div>

            {/* 详细信息表格 */}
            <div className="rounded-lg border border-border">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-border">
                    <td className="px-4 py-2.5 font-medium text-muted-foreground">
                      API Base URL
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs">
                      {provider.apiBaseUrl}
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-4 py-2.5 font-medium text-muted-foreground">
                      响应时间
                    </td>
                    <td className="px-4 py-2.5">{testResult.durationMs}ms</td>
                  </tr>
                  {testResult.statusCode !== undefined && (
                    <tr className="border-b border-border">
                      <td className="px-4 py-2.5 font-medium text-muted-foreground">
                        HTTP 状态码
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className={
                            testResult.success
                              ? "text-emerald-600"
                              : "text-red-600"
                          }
                        >
                          {testResult.statusCode}
                        </span>
                      </td>
                    </tr>
                  )}
                  {testResult.models && (
                    <tr>
                      <td className="px-4 py-2.5 font-medium text-muted-foreground">
                        可用模型
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex flex-wrap gap-1 max-h-48 overflow-y-auto">
                          {testResult.models.map((model) => (
                            <span
                              key={model}
                              className="inline-flex items-center rounded-md border border-border bg-muted px-2 py-0.5 text-xs font-medium"
                            >
                              {model}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* 错误详情 */}
            {!testResult.success && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950/30">
                <p className="text-xs font-medium text-red-700 dark:text-red-400">
                  错误详情
                </p>
                <p className="mt-1 text-xs text-red-600 dark:text-red-300">
                  {testResult.message}
                </p>
              </div>
            )}
          </div>
        )}
      </Dialog>
    </article>
  );
}

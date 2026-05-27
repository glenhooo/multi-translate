import { RotateCcw, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  createDefaultGeneralSettings,
  type GeneralSettings,
} from "@/lib/settings-storage";

type GeneralSettingsSectionProps = {
  general: GeneralSettings | undefined;
  onChange: (general: GeneralSettings) => void;
  onSave: () => void;
};

const inputClassName =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-60";

export function GeneralSettingsSection({
  general,
  onChange,
  onSave,
}: GeneralSettingsSectionProps) {
  const current = general ?? createDefaultGeneralSettings();

  function handleResetDefault() {
    onChange(createDefaultGeneralSettings());
  }

  return (
    <section id="general" className="flex flex-col gap-4">
      <div className="border-b border-border pb-3">
        <h1 className="text-2xl font-semibold tracking-tight md:text-xl">
          通用设置
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          配置应用全局偏好，包括百度语言检测凭据和翻译提示词模板。
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-xs md:p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="baidu-appid"
              className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
            >
              百度翻译 APPID
            </label>
            <input
              id="baidu-appid"
              className={inputClassName}
              value={current.baiduAppId}
              onChange={(event) =>
                onChange({ ...current, baiduAppId: event.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="baidu-key"
              className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
            >
              百度翻译 KEY
            </label>
            <input
              id="baidu-key"
              type="password"
              className={inputClassName}
              value={current.baiduKey}
              onChange={(event) =>
                onChange({ ...current, baiduKey: event.target.value })
              }
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          用于自动检测源语言，保存后新的检测请求会使用更新后的百度翻译配置。
          <a
            href="https://api.fanyi.baidu.com/product/14"
            target="_blank"
            className="text-primary"
          >
            获取Key→
          </a>
        </p>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="prompt-template"
            className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
          >
            翻译提示词
          </label>
          <Textarea
            id="prompt-template"
            className="min-h-32"
            value={current.promptTemplate}
            onChange={(event) =>
              onChange({ ...current, promptTemplate: event.target.value })
            }
          />
          <p className="mt-1 text-xs text-muted-foreground">
            可用变量：{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">
              {"{sourceText}"}
            </code>{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">
              {"{sourceLanguage}"}
            </code>{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">
              {"{targetLanguage}"}
            </code>
          </p>
        </div>

        <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="ghost"
            size="lg"
            className="gap-2 sm:min-w-24"
            onClick={handleResetDefault}
          >
            <RotateCcw className="size-4" />
            恢复默认
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
    </section>
  );
}

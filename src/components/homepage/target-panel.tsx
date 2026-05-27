"use client";

import { Check, ChevronDown } from "lucide-react";
import { DropdownMenu } from "radix-ui";

import { ProviderCard } from "./provider-card";
import type { TranslationState } from "./translation-workbench";
import type { TranslationProviderConfig } from "@/lib/settings-storage";
import {
  getLanguageName,
  SUPPORTED_LANGUAGES,
  type LanguageCode,
} from "@/lib/lang-detect";
import { cn } from "@/lib/utils";

type TargetPanelProps = {
  targetLang: LanguageCode;
  onTargetLangChange: (code: LanguageCode) => void;
  providers: TranslationProviderConfig[];
  translationStates: Record<string, TranslationState>;
  onRetry: (providerId: string) => void;
};

export function TargetPanel({
  targetLang,
  onTargetLangChange,
  providers,
  translationStates,
  onRetry,
}: TargetPanelProps) {
  return (
    <div className="flex w-full flex-col bg-muted/20 md:w-1/2">
      {/* Language Selector Header */}
      <div className="flex items-center border-b border-border/50 bg-muted/30 p-2">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center gap-1 rounded px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-muted">
              {getLanguageName(targetLang)}
              <ChevronDown className="size-[18px]" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="start"
              sideOffset={4}
              className="z-50 max-h-64 min-w-[140px] overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-md"
            >
              {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
                <DropdownMenu.Item
                  key={code}
                  onSelect={() => onTargetLangChange(code as LanguageCode)}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-4 rounded-md px-3 py-1.5 text-sm outline-none transition-colors hover:bg-muted",
                    targetLang === code && "font-medium text-primary",
                  )}
                >
                  <span>{name}</span>
                  {targetLang === code && <Check className="size-4" />}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      {/* Translation Results */}
      <div className="flex max-h-[calc(100vh-250px)] flex-col gap-4 overflow-y-auto p-4">
        {providers.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            暂无已启用的翻译服务商，请前往配置页添加并启用。
          </p>
        ) : (
          providers.map((provider) => (
            <ProviderCard
              key={provider.id}
              name={provider.name}
              modelId={provider.models[0]}
              state={
                translationStates[provider.id] ?? {
                  status: "idle",
                  text: "",
                }
              }
              onRetry={() => onRetry(provider.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

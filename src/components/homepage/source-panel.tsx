"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Square, X } from "lucide-react";
import { DropdownMenu } from "radix-ui";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  detectLanguage,
  getLanguageName,
  SUPPORTED_LANGUAGES,
  type LanguageCode,
} from "@/lib/lang-detect";
import { cn, getModifierKeyLabel } from "@/lib/utils";

const MAX_CHARS = 5000;
const DETECT_DEBOUNCE_MS = 500;

type DetectStatus =
  | { state: "idle" }
  | { state: "detecting" }
  | { state: "detected"; language: LanguageCode };

type SourcePanelProps = {
  text: string;
  onTextChange: (text: string) => void;
  onLanguageChange?: (lang: LanguageCode | null) => void;
  onTranslate?: () => void;
  onStop?: () => void;
  isTranslating?: boolean;
  manualLang?: LanguageCode | null;
  onManualLangChange?: (lang: LanguageCode | null) => void;
};

export function SourcePanel({
  text,
  onTextChange,
  onLanguageChange,
  onTranslate,
  onStop,
  isTranslating = false,
  manualLang: controlledManualLang,
  onManualLangChange,
}: SourcePanelProps) {
  const [detectStatus, setDetectStatus] = useState<DetectStatus>({
    state: "idle",
  });
  const [internalManualLang, setInternalManualLang] = useState<LanguageCode | null>(null);

  const manualLang = controlledManualLang !== undefined ? controlledManualLang : internalManualLang;
  const setManualLang = (lang: LanguageCode | null) => {
    if (onManualLangChange) {
      onManualLangChange(lang);
    } else {
      setInternalManualLang(lang);
    }
  };
  const [modifierLabel, setModifierLabel] = useState("Ctrl");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipDebounceRef = useRef(false);
  const pendingTranslateRef = useRef<string | null>(null);
  const onTranslateRef = useRef(onTranslate);
  onTranslateRef.current = onTranslate;

  useEffect(() => {
    setModifierLabel(getModifierKeyLabel());
  }, []);

  const runDetect = async (inputText: string) => {
    if (!inputText.trim()) {
      setDetectStatus({ state: "idle" });
      return;
    }

    setDetectStatus({ state: "detecting" });

    try {
      const language = await detectLanguage(inputText);
      setDetectStatus({ state: "detected", language });
    } catch {
      setDetectStatus({ state: "detected", language: "en" });
    }
  };

  useEffect(() => {
    if (manualLang || detectStatus.state === "detected") return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (!text.trim()) {
      setDetectStatus({ state: "idle" });
      return;
    }

    if (skipDebounceRef.current) {
      skipDebounceRef.current = false;
      runDetect(text);
      return;
    }

    timerRef.current = setTimeout(() => {
      runDetect(text);
    }, DETECT_DEBOUNCE_MS);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [text, manualLang, detectStatus.state]);

  function handleClear() {
    onTextChange("");
    setDetectStatus({ state: "idle" });
    setManualLang(null);
  }

  function handleManualSelect(code: LanguageCode | null) {
    setManualLang(code);
    if (code === null && text.trim()) {
      setDetectStatus({ state: "idle" });
    }
  }

  useEffect(() => {
    const effective =
      manualLang ??
      (detectStatus.state === "detected" ? detectStatus.language : null);
    onLanguageChange?.(effective);
  }, [manualLang, detectStatus, onLanguageChange]);

  useEffect(() => {
    if (detectStatus.state !== "detected") return;
    if (pendingTranslateRef.current === null) return;
    pendingTranslateRef.current = null;
    onTranslateRef.current?.();
  }, [detectStatus]);

  const detectLabel = (() => {
    if (manualLang) return getLanguageName(manualLang);
    if (detectStatus.state === "idle") return "自动检测";
    if (detectStatus.state === "detecting") return "检测中...";
    return getLanguageName(detectStatus.language);
  })();

  return (
    <div className="flex w-full flex-col border-border md:w-1/2 md:border-r">
      {/* Language Selector Header */}
      <div className="flex items-center justify-between border-b border-border/50 bg-muted/30 p-2">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center gap-1 rounded px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-muted">
              {detectLabel}
              <ChevronDown className="size-[18px]" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="start"
              sideOffset={4}
              className="z-50 max-h-64 min-w-[140px] overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-md"
            >
              <DropdownMenu.Item
                onSelect={() => handleManualSelect(null)}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-4 rounded-md px-3 py-1.5 text-sm transition-colors outline-none hover:bg-muted",
                  !manualLang && "font-medium text-primary"
                )}
              >
                <span>自动检测</span>
                {!manualLang && <Check className="size-4" />}
              </DropdownMenu.Item>

              <DropdownMenu.Separator className="my-1 h-px bg-border" />

              {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
                <DropdownMenu.Item
                  key={code}
                  onSelect={() => handleManualSelect(code as LanguageCode)}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-4 rounded-md px-3 py-1.5 text-sm transition-colors outline-none hover:bg-muted",
                    manualLang === code && "font-medium text-primary"
                  )}
                >
                  <span>{name}</span>
                  {manualLang === code && <Check className="size-4" />}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        <button
          onClick={handleClear}
          className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
          title="清除文本"
        >
          <X className="size-[20px]" />
        </button>
      </div>

      {/* Text Input */}
      <div className="relative flex flex-1 flex-col p-4">
        <Textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value.slice(0, MAX_CHARS))}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              onTranslate?.();
            }
          }}
          onPaste={(e) => {
            const pastedText = e.clipboardData.getData("text");
            if (!pastedText) return;
            e.preventDefault();

            const textarea = e.currentTarget;
            const { selectionStart, selectionEnd } = textarea;
            const newText = (
              text.slice(0, selectionStart) +
              pastedText +
              text.slice(selectionEnd)
            ).slice(0, MAX_CHARS);

            pendingTranslateRef.current = newText;
            skipDebounceRef.current = true;
            onTextChange(newText);
          }}
          placeholder="在此输入需要翻译的文本..."
          className="min-h-48 resize-none border-none bg-transparent text-base focus-visible:ring-0 md:min-h-64"
          maxLength={MAX_CHARS}
        />

        {/* Bottom Controls */}
        <div className="mt-auto flex items-end justify-between">
          <span className="text-xs text-muted-foreground">
            {text.length} / {MAX_CHARS}
          </span>
          <div className="flex items-center gap-2">
            <span className="rounded border border-border/60 bg-muted/50 px-1.5 py-0.5 font-mono text-[10px] leading-none text-muted-foreground select-none">
              {modifierLabel}
            </span>
            <span className="text-[10px] text-muted-foreground">
              + Enter 翻译
            </span>
            <Button
              variant={isTranslating ? "destructive" : "default"}
              className="gap-2"
              disabled={!isTranslating && !text.trim()}
              onClick={isTranslating ? onStop : () => onTranslate?.()}
            >
              {isTranslating ? (
                <>
                  <Square className="size-[14px] fill-current" />
                  停止
                </>
              ) : (
                <>翻译</>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

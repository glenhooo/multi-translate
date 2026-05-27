import { useCallback, useEffect, useRef, useState } from "react";

import {
  getLanguageName,
  type LanguageCode,
} from "@/lib/lang-detect";
import { replaceVariables } from "@/lib/prompt-template";
import {
  loadSettingsFromStorage,
  type TranslationProviderConfig,
} from "@/lib/settings-storage";
import { translateStream } from "@/lib/translate-api";

import { SourcePanel } from "./source-panel";
import { SwapButton } from "./swap-button";
import { TargetPanel } from "./target-panel";

export type TranslationState = {
  status: "idle" | "streaming" | "done" | "error";
  text: string;
  error?: string;
};

function getEnabledProviders(): TranslationProviderConfig[] {
  return loadSettingsFromStorage().providers.filter((p) => p.enabled);
}

export function TranslationWorkbench() {
  const [sourceText, setSourceText] = useState("");
  const [sourceLang, setSourceLang] = useState<LanguageCode | null>(null);
  const [sourceManualLang, setSourceManualLang] = useState<LanguageCode | null>(null);
  const [targetLang, setTargetLang] = useState<LanguageCode>("zh");
  const [providers, setProviders] = useState(getEnabledProviders);
  const [translationStates, setTranslationStates] = useState<
    Record<string, TranslationState>
  >({});
  const abortFnsRef = useRef<Map<string, () => void>>(new Map());
  const prevIsZh = useRef<boolean | null>(null);
  const skipAutoTargetRef = useRef(false);

  const refreshProviders = useCallback(
    () => setProviders(getEnabledProviders()),
    [],
  );

  useEffect(() => {
    window.addEventListener("storage", refreshProviders);
    return () => window.removeEventListener("storage", refreshProviders);
  }, [refreshProviders]);

  useEffect(() => {
    if (sourceLang === null) return;
    const isZh = sourceLang === "zh";
    if (skipAutoTargetRef.current) {
      skipAutoTargetRef.current = false;
      prevIsZh.current = isZh;
      return;
    }
    if (prevIsZh.current === null || prevIsZh.current !== isZh) {
      setTargetLang(isZh ? "en" : "zh");
    }
    prevIsZh.current = isZh;
  }, [sourceLang]);

  const handleSourceLangChange = useCallback(
    (lang: LanguageCode | null) => setSourceLang(lang),
    [],
  );

  const isTranslating = Object.values(translationStates).some(
    (s) => s.status === "streaming",
  );

  const buildPrompt = useCallback(() => {
    const settings = loadSettingsFromStorage();
    const template =
      settings.general?.promptTemplate ??
      "Translate the following {sourceLanguage} text to {targetLanguage}. Only return the translated text, nothing else.\n\n{sourceText}";

    return replaceVariables(template, {
      sourceText,
      sourceLanguage: getLanguageName(sourceLang ?? "en"),
      targetLanguage: getLanguageName(targetLang),
    });
  }, [sourceText, sourceLang, targetLang]);

  const translateProvider = useCallback(
    async (provider: TranslationProviderConfig, prompt: string) => {
      try {
        setTranslationStates((prev) => ({
          ...prev,
          [provider.id]: { status: "streaming", text: "" },
        }));

        await translateStream(provider, prompt, (chunk) => {
          setTranslationStates((prev) => ({
            ...prev,
            [provider.id]: {
              status: "streaming",
              text: (prev[provider.id]?.text ?? "") + chunk,
            },
          }));
        }, {
          onStreamReady: (abort) => {
            abortFnsRef.current.set(provider.id, abort);
          },
        });

        abortFnsRef.current.delete(provider.id);

        setTranslationStates((prev) => ({
          ...prev,
          [provider.id]: {
            status: "done",
            text: prev[provider.id]?.text ?? "",
          },
        }));
      } catch (err) {
        abortFnsRef.current.delete(provider.id);

        setTranslationStates((prev) => ({
          ...prev,
          [provider.id]: {
            status: "error",
            text: prev[provider.id]?.text ?? "",
            error: err instanceof Error ? err.message : "翻译请求失败",
          },
        }));
      }
    },
    [],
  );

  const handleTranslate = useCallback(
    async (textOverride?: string) => {
      const effectiveText = textOverride ?? sourceText;
      if (!effectiveText.trim() || providers.length === 0) return;
      if (
        Object.values(translationStates).some((s) => s.status === "streaming")
      )
        return;

      const settings = loadSettingsFromStorage();
      const template =
        settings.general?.promptTemplate ??
        "Translate the following {sourceLanguage} text to {targetLanguage}. Only return the translated text, nothing else.\n\n{sourceText}";

      const prompt = replaceVariables(template, {
        sourceText: effectiveText,
        sourceLanguage: getLanguageName(sourceLang ?? "en"),
        targetLanguage: getLanguageName(targetLang),
      });

      const initial: Record<string, TranslationState> = {};
      for (const p of providers) {
        initial[p.id] = { status: "idle", text: "" };
      }
      setTranslationStates(initial);

      await Promise.allSettled(
        providers.map((provider) => translateProvider(provider, prompt)),
      );
    },
    [sourceText, sourceLang, targetLang, providers, translationStates],
  );

  const handleRetryProvider = useCallback(
    async (providerId: string) => {
      if (!sourceText.trim()) return;
      if (
        Object.values(translationStates).some((s) => s.status === "streaming")
      )
        return;

      const provider = providers.find((p) => p.id === providerId);
      if (!provider) return;

      const prompt = buildPrompt();
      await translateProvider(provider, prompt);
    },
    [sourceText, providers, translationStates, buildPrompt, translateProvider],
  );

  const handleStop = useCallback(() => {
    for (const [, abort] of abortFnsRef.current) {
      abort();
    }
    abortFnsRef.current.clear();

    setTranslationStates((prev) => {
      const next = { ...prev };
      for (const [id, state] of Object.entries(next)) {
        if (state.status === "streaming") {
          next[id] = { ...state, status: "done" };
        }
      }
      return next;
    });
  }, []);

  const handleSwap = useCallback(() => {
    if (sourceLang === null) return;
    skipAutoTargetRef.current = true;
    const oldTarget = targetLang;
    setTargetLang(sourceLang);
    setSourceManualLang(oldTarget);
  }, [sourceLang, targetLang]);

  return (
    <div className="w-full">
      {/* Workbench Panels */}
      <div className="relative flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-xs md:flex-row">
        <SourcePanel
          text={sourceText}
          onTextChange={setSourceText}
          onLanguageChange={handleSourceLangChange}
          onTranslate={handleTranslate}
          onStop={handleStop}
          isTranslating={isTranslating}
          manualLang={sourceManualLang}
          onManualLangChange={setSourceManualLang}
        />

        {/* Desktop swap button - absolute center */}
        <div className="absolute top-1/2 left-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 md:flex">
          <SwapButton orientation="horizontal" disabled={sourceLang === null} onClick={handleSwap} />
        </div>

        {/* Mobile swap button - between panels */}
        <div className="relative z-10 flex -my-3 justify-center md:hidden">
          <SwapButton orientation="vertical" disabled={sourceLang === null} onClick={handleSwap} />
        </div>

        <TargetPanel
          targetLang={targetLang}
          onTargetLangChange={setTargetLang}
          providers={providers}
          translationStates={translationStates}
          onRetry={handleRetryProvider}
        />
      </div>
    </div>
  );
}

import { DEFAULT_PROMPT_TEMPLATE } from "@/lib/prompt-template";

export const SETTINGS_STORAGE_KEY = "multi-translate:settings:v1";

export const DEFAULT_BAIDU_APPID = "";
export const DEFAULT_BAIDU_KEY = "";

export type TranslationProviderConfig = {
  id: string;
  name: string;
  enabled: boolean;
  type: "openai-compatible";
  apiBaseUrl: string;
  apiKey: string;
  models: string[];
};

export type GeneralSettings = {
  promptTemplate: string;
  baiduAppId: string;
  baiduKey: string;
};

export type MultiTranslateSettings = {
  schemaVersion: 1;
  providers: TranslationProviderConfig[];
  general?: GeneralSettings;
  updatedAt: string;
};

export function createDefaultGeneralSettings(): GeneralSettings {
  return {
    promptTemplate: DEFAULT_PROMPT_TEMPLATE,
    baiduAppId: DEFAULT_BAIDU_APPID,
    baiduKey: DEFAULT_BAIDU_KEY,
  };
}

function normalizeGeneralSettings(
  general: Partial<GeneralSettings> = {}
): GeneralSettings {
  return {
    ...createDefaultGeneralSettings(),
    ...general,
  };
}

function nowIso() {
  return new Date().toISOString();
}

function createProviderId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `provider-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(
  source: Record<string, unknown>,
  key: string,
  label: string
) {
  const value = source[key];

  if (typeof value !== "string") {
    throw new Error(`${label} must be a string`);
  }

  return value;
}

function readBoolean(
  source: Record<string, unknown>,
  key: string,
  label: string
) {
  const value = source[key];

  if (typeof value !== "boolean") {
    throw new Error(`${label} must be a boolean`);
  }

  return value;
}

function parseProvider(
  value: unknown,
  index: number
): TranslationProviderConfig {
  if (!isRecord(value)) {
    throw new Error(`Provider ${index + 1} must be an object`);
  }

  const type = value.type;
  if (type !== "openai-compatible") {
    throw new Error(`Provider ${index + 1} type is unsupported`);
  }

  const models = value.models;
  if (
    !Array.isArray(models) ||
    !models.every((model) => typeof model === "string")
  ) {
    throw new Error(`Provider ${index + 1} models must be strings`);
  }

  return {
    id: readString(value, "id", `Provider ${index + 1} id`),
    name: readString(value, "name", `Provider ${index + 1} name`),
    enabled: readBoolean(value, "enabled", `Provider ${index + 1} enabled`),
    type,
    apiBaseUrl: readString(
      value,
      "apiBaseUrl",
      `Provider ${index + 1} API Base URL`
    ),
    apiKey: readString(value, "apiKey", `Provider ${index + 1} API Key`),
    models: models.map((model) => model.trim()).filter(Boolean),
  };
}

function parseGeneralSettings(value: unknown): GeneralSettings | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const promptTemplate = value.promptTemplate;
  const baiduAppId = value.baiduAppId;
  const baiduKey = value.baiduKey;

  if (typeof promptTemplate !== "string" || promptTemplate.length === 0) {
    return undefined;
  }

  return normalizeGeneralSettings({
    promptTemplate,
    baiduAppId: typeof baiduAppId === "string" ? baiduAppId : undefined,
    baiduKey: typeof baiduKey === "string" ? baiduKey : undefined,
  });
}

function parseSettings(value: unknown): MultiTranslateSettings {
  if (!isRecord(value)) {
    throw new Error("Settings file must contain an object");
  }

  if (value.schemaVersion !== 1) {
    throw new Error("Unsupported settings schema version");
  }

  if (!Array.isArray(value.providers)) {
    throw new Error("Settings providers must be an array");
  }

  const updatedAt = readString(value, "updatedAt", "Settings updatedAt");

  return {
    schemaVersion: 1,
    providers: value.providers.map(parseProvider),
    general: parseGeneralSettings(value.general),
    updatedAt,
  };
}

export function createProvider(
  overrides: Partial<TranslationProviderConfig> = {}
): TranslationProviderConfig {
  return {
    id: overrides.id ?? createProviderId(),
    name: overrides.name ?? "OpenAI Provider",
    enabled: overrides.enabled ?? true,
    type: "openai-compatible",
    apiBaseUrl: overrides.apiBaseUrl ?? "https://api.openai.com/v1",
    apiKey: overrides.apiKey ?? "",
    models: overrides.models ?? ["gpt-4-turbo", "gpt-3.5-turbo"],
  };
}

export function createDefaultSettings(): MultiTranslateSettings {
  return {
    schemaVersion: 1,
    providers: [
      createProvider({
        id: "provider-openai-primary",
        name: "OpenAI Primary",
      }),
    ],
    general: createDefaultGeneralSettings(),
    updatedAt: nowIso(),
  };
}

export function loadSettingsFromStorage(): MultiTranslateSettings {
  if (typeof window === "undefined") {
    return createDefaultSettings();
  }

  const rawSettings = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
  if (!rawSettings) {
    return createDefaultSettings();
  }

  try {
    return parseSettings(JSON.parse(rawSettings));
  } catch {
    return createDefaultSettings();
  }
}

export function withUpdatedAt(
  settings: MultiTranslateSettings
): MultiTranslateSettings {
  return {
    schemaVersion: 1,
    providers: settings.providers,
    general: normalizeGeneralSettings(settings.general),
    updatedAt: nowIso(),
  };
}

export function saveSettingsToStorage(
  settings: MultiTranslateSettings
): MultiTranslateSettings {
  const nextSettings = withUpdatedAt(settings);

  if (typeof window !== "undefined") {
    window.localStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify(nextSettings)
    );
  }

  return nextSettings;
}

export function parseSettingsJson(json: string): MultiTranslateSettings {
  return parseSettings(JSON.parse(json));
}

export function serializeSettings(settings: MultiTranslateSettings) {
  return JSON.stringify(withUpdatedAt(settings), null, 2);
}

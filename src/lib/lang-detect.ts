import md5 from "@/lib/md5";
import {
  createDefaultGeneralSettings,
  loadSettingsFromStorage,
  type GeneralSettings,
} from "@/lib/settings-storage";

/**
 * 百度翻译 API 语言检测（JSONP）。
 * 使用 /api/trans/vip/language 接口，成功时返回 data.src 即为检测到的源语言。
 */

const BAIDU_API_URL = "https://fanyi-api.baidu.com/api/trans/vip/language";

export const SUPPORTED_LANGUAGES = {
  zh: "中文",
  en: "英语",
  jp: "日语",
  kor: "韩语",
  th: "泰语",
  vie: "越南语",
  ru: "俄语",
} as const;

export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES;

const SUPPORTED_LANG_CODES = new Set<string>(Object.keys(SUPPORTED_LANGUAGES));

export function getLanguageName(code: string): string {
  return SUPPORTED_LANGUAGES[code as keyof typeof SUPPORTED_LANGUAGES] ?? code;
}

const DETECT_TIMEOUT_MS = 5_000;
const MAX_DETECT_LENGTH = 200;

let jsonpCounter = 0;

type BaiduDetectResponse = {
  error_code: number;
  error_msg: string;
  data: {
    src: string;
  };
};

type BaiduDetectConfig = Pick<GeneralSettings, "baiduAppId" | "baiduKey">;

function getBaiduDetectConfig(): BaiduDetectConfig {
  const general =
    loadSettingsFromStorage().general ?? createDefaultGeneralSettings();

  return {
    baiduAppId: general.baiduAppId.trim(),
    baiduKey: general.baiduKey.trim(),
  };
}

function jsonp<T>(url: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const callbackName = `__baidu_jsonp_${jsonpCounter++}_${Date.now()}`;
    const script = document.createElement("script");

    const cleanup = () => {
      delete (window as unknown as Record<string, unknown>)[callbackName];
      script.remove();
    };

    const timeoutId = setTimeout(() => {
      cleanup();
      reject(new Error("JSONP request timeout"));
    }, DETECT_TIMEOUT_MS);

    (window as unknown as Record<string, (data: T) => void>)[callbackName] = (
      data: T
    ) => {
      clearTimeout(timeoutId);
      cleanup();
      resolve(data);
    };

    script.src = `${url}&callback=${callbackName}`;
    script.onerror = () => {
      clearTimeout(timeoutId);
      cleanup();
      reject(new Error("JSONP script load error"));
    };

    document.head.append(script);
  });
}

function buildSign(
  query: string,
  salt: number,
  config: BaiduDetectConfig
): string {
  const raw = config.baiduAppId + query + salt + config.baiduKey;
  return md5(raw);
}

export async function detectLanguage(text: string): Promise<LanguageCode> {
  if (!text.trim()) {
    return "en";
  }

  const config = getBaiduDetectConfig();

  if (!config.baiduAppId || !config.baiduKey) {
    return "en";
  }

  const query = text.slice(0, MAX_DETECT_LENGTH);
  const salt = Date.now();
  const sign = buildSign(query, salt, config);

  const params = new URLSearchParams({
    q: query,
    appid: config.baiduAppId,
    salt: String(salt),
    sign,
  });

  try {
    const res = await jsonp<BaiduDetectResponse>(
      `${BAIDU_API_URL}?${params.toString()}`
    );

    if (res.error_code !== 0) {
      console.error("detectLanguage error:", res.error_code, res.error_msg);
      return "en";
    }

    const detected = res.data.src;
    if (SUPPORTED_LANG_CODES.has(detected)) {
      return detected as LanguageCode;
    }

    return "en";
  } catch {
    return "en";
  }
}

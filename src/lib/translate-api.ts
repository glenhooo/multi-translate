import OpenAI from "openai"
import type { TranslationProviderConfig } from "@/lib/settings-storage"

export type ProviderTestResult = {
  success: boolean
  message: string
  models?: string[]
  statusCode?: number
  durationMs: number
}

/**
 * 测试 OpenAI 兼容 API 的连接。
 * 调用 GET {apiBaseUrl}/models 验证 URL 可达性和 API Key 有效性。
 */
export async function checkProviderConnection(
  provider: TranslationProviderConfig
): Promise<ProviderTestResult> {
  const url = `${provider.apiBaseUrl.replace(/\/+$/, "")}/models`
  const startTime = performance.now()

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10_000)

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${provider.apiKey}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    const elapsed = Math.round(performance.now() - startTime)

    if (!response.ok) {
      const bodyText = await response.text().catch(() => "")
      const errorDetail = bodyText ? `: ${bodyText.slice(0, 200)}` : ""

      return {
        success: false,
        statusCode: response.status,
        message: `HTTP ${response.status} ${response.statusText}${errorDetail}`,
        durationMs: elapsed,
      }
    }

    const data = await response.json()
    const models: string[] = (data.data ?? [])
      .map((m: { id: string }) => m.id)
      .filter((id: unknown): id is string => typeof id === "string")

    return {
      success: true,
      message: `连接成功，响应时间 ${elapsed}ms，发现 ${models.length} 个模型`,
      models,
      durationMs: elapsed,
    }
  } catch (error) {
    const elapsed = Math.round(performance.now() - startTime)

    if (error instanceof DOMException && error.name === "AbortError") {
      return {
        success: false,
        message: `连接超时（${elapsed}ms），请检查 API Base URL 是否正确`,
        durationMs: elapsed,
      }
    }

    if (error instanceof TypeError && error.message === "Failed to fetch") {
      return {
        success: false,
        message:
          "无法连接到服务器，请检查 API Base URL 是否正确以及网络连接是否正常",
        durationMs: elapsed,
      }
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : "未知错误",
      durationMs: elapsed,
    }
  }
}

export async function translateStream(
  provider: TranslationProviderConfig,
  prompt: string,
  onChunk: (text: string) => void,
  options?: { onStreamReady?: (abort: () => void) => void },
): Promise<void> {
  const TIMEOUT_MS = 30_000

  const client = new OpenAI({
    apiKey: provider.apiKey,
    baseURL: provider.apiBaseUrl.replace(/\/+$/, ""),
    dangerouslyAllowBrowser: true,
    timeout: TIMEOUT_MS,
  })

  const model = provider.models[0]

  const abortController = new AbortController()

  const stream = await client.chat.completions.create({
    model,
    messages: [{ role: "user", content: prompt }],
    stream: true,
  }, { signal: abortController.signal })

  options?.onStreamReady?.(() => abortController.abort())

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content ?? ""
    if (content) {
      onChunk(content)
    }
  }
}
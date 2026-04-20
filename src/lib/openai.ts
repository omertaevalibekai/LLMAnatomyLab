import crypto from "node:crypto";
import OpenAI, { APIError } from "openai";
import { responseCache } from "@/lib/cache";
import { requireServerEnv } from "@/lib/env";
import {
  BatchAnalyzeResult,
  LogprobsResponse,
  ModelId,
  MultiModelResult,
  SequenceLogprobsResponse,
  TokenLogprob,
} from "@/lib/types";

const DEFAULT_MODEL: ModelId = "gpt-4o-mini";
const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);

let openaiClient: OpenAI | null = null;

const hashKey = (payload: string): string =>
  crypto.createHash("sha256").update(payload).digest("hex");

const sleep = async (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const withBackoff = async <T>(operation: () => Promise<T>, maxRetries = 4): Promise<T> => {
  let attempt = 0;
  while (true) {
    try {
      return await operation();
    } catch (error) {
      const status = error instanceof APIError ? error.status : undefined;
      if (attempt >= maxRetries || !status || !RETRYABLE_STATUS.has(status)) throw error;
      await sleep(250 * 2 ** attempt);
      attempt += 1;
    }
  }
};

const mapTopLogprobs = (
  entries: Array<{ token: string; logprob: number }> | null | undefined,
): TokenLogprob[] => {
  if (!entries) return [];
  return entries.map((entry) => ({
    token: entry.token,
    logprob: entry.logprob,
    probability: Math.exp(entry.logprob),
  }));
};

const getOpenAIClient = (): OpenAI => {
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: requireServerEnv("OPENAI_API_KEY") });
  }
  return openaiClient;
};

const toUsage = (
  usage: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number } | undefined,
) => ({
  promptTokens: usage?.prompt_tokens ?? 0,
  completionTokens: usage?.completion_tokens ?? 0,
  totalTokens: usage?.total_tokens ?? 0,
});

export const getLogprobs = async (
  prompt: string,
  model: ModelId = DEFAULT_MODEL,
): Promise<LogprobsResponse> => {
  const cacheKey = hashKey(JSON.stringify({ fn: "getLogprobs", prompt, model }));
  const cached = responseCache.get<LogprobsResponse>(cacheKey);
  if (cached) return { ...cached, cached: true };

  const openai = getOpenAIClient();
  const completion = await withBackoff(() =>
    openai.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1,
      temperature: 0,
      logprobs: true,
      top_logprobs: 10,
    }),
  );

  const content = completion.choices[0]?.logprobs?.content ?? [];
  const positions = content.map((item, index) => ({
    position: index,
    observedToken: item.token,
    topLogprobs: mapTopLogprobs(item.top_logprobs),
  }));

  const response: LogprobsResponse = {
    model,
    prompt,
    positions,
    usage: toUsage(completion.usage),
    cached: false,
  };
  responseCache.set(cacheKey, response);
  return response;
};

export const getLogprobsSequence = async (
  prompt: string,
  model: ModelId = DEFAULT_MODEL,
): Promise<SequenceLogprobsResponse> => {
  const cacheKey = hashKey(JSON.stringify({ fn: "getLogprobsSequence", prompt, model }));
  const cached = responseCache.get<SequenceLogprobsResponse>(cacheKey);
  if (cached) return { ...cached, cached: true };

  const openai = getOpenAIClient();
  const completion = await withBackoff(() =>
    openai.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 48,
      temperature: 0,
      logprobs: true,
      top_logprobs: 10,
    }),
  );

  const choice = completion.choices[0];
  const content = choice?.logprobs?.content ?? [];
  const positions = content.map((item, index) => ({
    position: index,
    observedToken: item.token,
    topLogprobs: mapTopLogprobs(item.top_logprobs),
  }));

  const response: SequenceLogprobsResponse = {
    model,
    prompt,
    text: choice?.message?.content ?? "",
    positions,
    usage: toUsage(completion.usage),
    cached: false,
  };
  responseCache.set(cacheKey, response);
  return response;
};

export const getMultipleCompletions = async (
  prompt: string,
  models: ModelId[],
): Promise<MultiModelResult[]> => {
  const uniqueModels = Array.from(new Set(models));
  return Promise.all(
    uniqueModels.map(async (model) => ({
      model,
      response: await getLogprobs(prompt, model),
    })),
  );
};

export const batchAnalyze = async (prompts: string[], model: ModelId): Promise<BatchAnalyzeResult> => {
  const failures: BatchAnalyzeResult["failures"] = [];
  const results: LogprobsResponse[] = [];

  for (const [index, prompt] of prompts.entries()) {
    try {
      results.push(await getLogprobs(prompt, model));
      await sleep(100);
    } catch (error) {
      failures.push({
        index,
        prompt,
        error: error instanceof Error ? error.message : "Unknown OpenAI error",
      });
    }
  }

  return { model, results, failures };
};

export type ModelId = "gpt-4o" | "gpt-4o-mini" | "gpt-3.5-turbo";

export interface TokenLogprob {
  token: string;
  logprob: number;
  probability: number;
}

export interface TokenPositionLogprobs {
  position: number;
  observedToken: string;
  topLogprobs: TokenLogprob[];
}

export interface UsageMetrics {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface LogprobsResponse {
  model: string;
  prompt: string;
  positions: TokenPositionLogprobs[];
  usage: UsageMetrics;
  cached: boolean;
}

export interface SequenceLogprobsResponse extends LogprobsResponse {
  text: string;
}

export interface MultiModelResult {
  model: ModelId;
  response: LogprobsResponse;
}

export interface BatchAnalyzeResult {
  model: ModelId;
  results: LogprobsResponse[];
  failures: { index: number; prompt: string; error: string }[];
}

export interface DiffResult {
  position: number;
  token: string;
  averageAbsoluteDelta: number;
  deltas: Array<{ token: string; delta: number }>;
}

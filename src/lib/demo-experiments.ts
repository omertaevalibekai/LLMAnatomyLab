import { jensenShannonDivergence } from "@/lib/analysis";

export interface CandidateToken {
  token: string;
  probability: number;
}

export interface PositionLandscape {
  position: number;
  sourceToken: string;
  candidates: CandidateToken[];
}

const VOCAB = [
  "the",
  "a",
  "is",
  "are",
  "because",
  "model",
  "context",
  "probability",
  "signal",
  "latent",
  "reasoning",
  "token",
  "analysis",
  "predict",
  "uncertainty",
  "therefore",
  "however",
  "and",
  "or",
  "not",
];

const hash = (value: string): number => {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return Math.abs(h >>> 0);
};

const normalize = (values: number[]): number[] => {
  const total = values.reduce((acc, value) => acc + value, 0);
  return values.map((value) => value / total);
};

export const buildLandscape = (text: string, topN = 10): PositionLandscape[] => {
  const tokens = text.trim().split(/\s+/).filter(Boolean);
  return tokens.map((token, index) => {
    const seed = hash(`${token}:${index}`);
    const raw = VOCAB.slice(0, topN).map((_, candidateIndex) => {
      const value = ((seed + candidateIndex * 7919) % 1000) / 1000;
      return Math.pow(0.15 + value, 2);
    });
    const probs = normalize(raw);
    const candidates = VOCAB.slice(0, topN).map((candidate, candidateIndex) => ({
      token: candidate,
      probability: probs[candidateIndex] ?? 0,
    }));
    return { position: index, sourceToken: token, candidates };
  });
};

export const confidenceByContext = (text: string): Array<{ contextLength: number; confidence: number }> => {
  const tokens = text.trim().split(/\s+/).filter(Boolean);
  return Array.from({ length: tokens.length }, (_, index) => {
    const contextLength = tokens.length - index;
    const signal = Math.max(0.12, 1 - index / Math.max(tokens.length, 1));
    const modulation = 0.12 * Math.sin((index + 1) * 0.9);
    return {
      contextLength,
      confidence: Math.max(0.05, Math.min(0.99, signal + modulation)),
    };
  });
};

export const compareModels = (text: string): Array<{
  model: string;
  entropy: number;
  topPrediction: string;
  topProbability: number;
  distribution: number[];
}> => {
  const base = buildLandscape(text, 8)[0]?.candidates.map((candidate) => candidate.probability) ?? [];
  const variants = [
    { model: "gpt-4o", bias: 1.05 },
    { model: "gpt-4o-mini", bias: 0.92 },
    { model: "gpt-3.5-turbo", bias: 0.8 },
  ];

  return variants.map((variant, index) => {
    const adjusted = normalize(
      base.map((value, candidateIndex) => {
        const skew = 1 + Math.sin((candidateIndex + 1) * (0.6 + index * 0.2)) * 0.08;
        return Math.pow(value * skew, variant.bias);
      }),
    );
    const topIndex = adjusted.indexOf(Math.max(...adjusted));
    const entropy = -adjusted.reduce(
      (acc, probability) => (probability > 0 ? acc + probability * Math.log2(probability) : acc),
      0,
    );
    return {
      model: variant.model,
      entropy,
      topPrediction: VOCAB[topIndex] ?? "token",
      topProbability: adjusted[topIndex] ?? 0,
      distribution: adjusted,
    };
  });
};

export const divergenceScore = (text: string): number => {
  const models = compareModels(text);
  if (models.length < 2) return 0;
  const first = models[0]?.distribution ?? [];
  const second = models[1]?.distribution ?? [];
  return jensenShannonDivergence(first, second);
};

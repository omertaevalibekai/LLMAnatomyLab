import { DiffResult, TokenPositionLogprobs } from "@/lib/types";

const EPSILON = 1e-12;

/**
 * Computes Shannon entropy (bits) for a probability distribution.
 * @param probs Distribution values.
 * @returns Entropy in bits.
 */
export const entropy = (probs: number[]): number => {
  const normalized = normalizeDistribution(probs);
  return normalized.reduce((acc, p) => (p > 0 ? acc - p * Math.log2(p) : acc), 0);
};

/**
 * Computes KL divergence D(P || Q) in bits.
 * @param p Source distribution.
 * @param q Target distribution.
 * @returns Divergence in bits.
 */
export const klDivergence = (p: number[], q: number[]): number => {
  if (p.length !== q.length) {
    throw new Error("Distributions must have equal length");
  }
  const pNorm = normalizeDistribution(p);
  const qNorm = normalizeDistribution(q);

  return pNorm.reduce((acc, pVal, i) => {
    const qVal = Math.max(qNorm[i] ?? EPSILON, EPSILON);
    return pVal > 0 ? acc + pVal * Math.log2(pVal / qVal) : acc;
  }, 0);
};

/**
 * Computes Jensen-Shannon divergence in bits.
 * @param p First distribution.
 * @param q Second distribution.
 * @returns Symmetric divergence in bits.
 */
export const jensenShannonDivergence = (p: number[], q: number[]): number => {
  if (p.length !== q.length) {
    throw new Error("Distributions must have equal length");
  }
  const pNorm = normalizeDistribution(p);
  const qNorm = normalizeDistribution(q);
  const m = pNorm.map((value, index) => 0.5 * (value + (qNorm[index] ?? 0)));
  return 0.5 * klDivergence(pNorm, m) + 0.5 * klDivergence(qNorm, m);
};

/**
 * Applies softmax with temperature scaling over logits.
 * @param logits Input logits.
 * @param temperature Sampling temperature > 0.
 * @returns Probability distribution.
 */
export const applyTemperature = (logits: number[], temperature: number): number[] => {
  if (temperature <= 0) {
    throw new Error("Temperature must be > 0");
  }
  const scaled = logits.map((logit) => logit / temperature);
  const maxLogit = Math.max(...scaled);
  const exps = scaled.map((logit) => Math.exp(logit - maxLogit));
  return normalizeDistribution(exps);
};

/**
 * Applies top-k filtering to a probability distribution.
 * @param probs Input probabilities.
 * @param k Number of highest-probability items to retain.
 * @returns Renormalized filtered distribution.
 */
export const applyTopK = (probs: number[], k: number): number[] => {
  if (k <= 0) {
    throw new Error("k must be > 0");
  }
  if (k >= probs.length) {
    return normalizeDistribution(probs);
  }
  const indexed = probs
    .map((value, index) => ({ value, index }))
    .sort((a, b) => b.value - a.value);
  const keep = new Set(indexed.slice(0, k).map((item) => item.index));
  return normalizeDistribution(probs.map((value, index) => (keep.has(index) ? value : 0)));
};

/**
 * Applies nucleus (top-p) sampling cutoff to probabilities.
 * @param probs Input probabilities.
 * @param p Cumulative probability threshold.
 * @returns Renormalized filtered distribution.
 */
export const applyTopP = (probs: number[], p: number): number[] => {
  if (p <= 0 || p > 1) {
    throw new Error("p must be in (0, 1]");
  }
  const normalized = normalizeDistribution(probs);
  const indexed = normalized
    .map((value, index) => ({ value, index }))
    .sort((a, b) => b.value - a.value);

  let cumulative = 0;
  const keep = new Set<number>();
  for (const item of indexed) {
    keep.add(item.index);
    cumulative += item.value;
    if (cumulative >= p) break;
  }
  return normalizeDistribution(normalized.map((value, index) => (keep.has(index) ? value : 0)));
};

/**
 * Estimates effective vocabulary size after temperature scaling.
 * @param probs Input probabilities.
 * @param temperature Sampling temperature.
 * @returns Number of tokens with probability >= 1%.
 */
export const effectiveVocabSize = (probs: number[], temperature: number): number => {
  const logits = probs.map((value) => Math.log(Math.max(value, EPSILON)));
  const transformed = applyTemperature(logits, temperature);
  return transformed.filter((value) => value >= 0.01).length;
};

/**
 * Computes per-position probability deltas from perturbation experiments.
 * @param original Baseline token distributions.
 * @param perturbed Perturbed token distributions.
 * @returns Position-wise impact summary.
 */
export const perturbationImpact = (
  original: TokenPositionLogprobs[],
  perturbed: TokenPositionLogprobs[],
): DiffResult[] => {
  const perturbedByPosition = new Map(perturbed.map((item) => [item.position, item]));
  return original.map((positionData) => {
    const comparison = perturbedByPosition.get(positionData.position);
    if (!comparison) {
      return {
        position: positionData.position,
        token: positionData.observedToken,
        averageAbsoluteDelta: 0,
        deltas: [],
      };
    }

    const compareMap = new Map(
      comparison.topLogprobs.map((entry) => [entry.token, entry.probability]),
    );
    const deltas = positionData.topLogprobs.map((entry) => ({
      token: entry.token,
      delta: (compareMap.get(entry.token) ?? 0) - entry.probability,
    }));

    return {
      position: positionData.position,
      token: positionData.observedToken,
      averageAbsoluteDelta:
        deltas.reduce((acc, item) => acc + Math.abs(item.delta), 0) / Math.max(deltas.length, 1),
      deltas,
    };
  });
};

const normalizeDistribution = (distribution: number[]): number[] => {
  const nonNegative = distribution.map((value) => (Number.isFinite(value) && value > 0 ? value : 0));
  const total = nonNegative.reduce((acc, value) => acc + value, 0);
  if (total <= 0) throw new Error("Distribution must contain positive mass");
  return nonNegative.map((value) => value / total);
};

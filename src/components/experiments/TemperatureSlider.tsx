"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { applyTemperature, entropy, effectiveVocabSize } from "@/lib/analysis";

interface TemperatureSliderProps {
  logits: number[];
  labels: string[];
  temperature: number;
  topK: number;
  topP: number;
}

export const TemperatureSlider = ({
  logits,
  labels,
  temperature,
  topK,
  topP,
}: TemperatureSliderProps): JSX.Element => {
  const distribution = useMemo(() => {
    return applyTemperature(logits, temperature)
      .map((probability, index) => ({
        label: labels[index] ?? `tok_${index}`,
        probability,
      }))
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 50);
  }, [labels, logits, temperature]);

  const stats = useMemo(() => {
    const probs = distribution.map((item) => item.probability);
    const h = entropy(probs);
    return {
      entropy: h,
      perplexity: Math.pow(2, h),
      effectiveVocab: effectiveVocabSize(probs, 1),
    };
  }, [distribution]);

  let cumulative = 0;
  const topPIndex = distribution.findIndex((entry) => {
    cumulative += entry.probability;
    return cumulative >= topP;
  });

  return (
    <div className="space-y-6 rounded-lg bg-bg-secondary p-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Metric label="Entropy" value={stats.entropy.toFixed(3)} />
        <Metric label="Perplexity" value={stats.perplexity.toFixed(3)} />
        <Metric label="Effective Vocab" value={String(stats.effectiveVocab)} />
      </div>
      <div className="max-h-[420px] space-y-2 overflow-y-auto rounded-md bg-bg-primary p-4">
        {distribution.map((item, index) => {
          const color =
            index < topK ? "bg-accent-purple" : index <= topPIndex ? "bg-accent-emerald" : "bg-accent-blue";
          return (
            <div key={`${item.label}-${index}`}>
              <div className="mb-1 flex items-center justify-between text-xs text-text-secondary">
                <span className="font-mono">{item.label}</span>
                <span>{(item.probability * 100).toFixed(2)}%</span>
              </div>
              <div className="h-2 rounded bg-bg-tertiary">
                <motion.div
                  className={`h-full rounded ${color}`}
                  initial={false}
                  animate={{ width: `${Math.max(item.probability * 100, 1)}%` }}
                  transition={{ type: "spring", stiffness: 130, damping: 18 }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Metric = ({ label, value }: { label: string; value: string }): JSX.Element => (
  <div className="rounded-md bg-bg-primary p-3">
    <p className="text-xs uppercase text-text-secondary">{label}</p>
    <p className="font-mono text-lg text-text-primary">{value}</p>
  </div>
);

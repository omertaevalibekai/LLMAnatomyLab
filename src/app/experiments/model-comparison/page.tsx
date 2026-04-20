"use client";

import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { compareModels, divergenceScore } from "@/lib/demo-experiments";

const DEFAULT_TEXT = "The capital of France is";

export default function ModelComparisonPage(): JSX.Element {
  const [text, setText] = useState(DEFAULT_TEXT);
  const models = useMemo(() => compareModels(text), [text]);
  const divergence = useMemo(() => divergenceScore(text), [text]);
  const chartData = models.map((item) => ({
    model: item.model,
    entropy: Number(item.entropy.toFixed(3)),
    topProbability: Number((item.topProbability * 100).toFixed(2)),
  }));

  return (
    <section className="space-y-4">
      <div className="panel space-y-3 p-6">
        <h1 className="font-mono text-2xl">Experiment 4: Cross-Model Behavioral Comparison</h1>
        <textarea
          className="w-full rounded-md border border-white/10 bg-bg-primary p-3 text-sm outline-none"
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={2}
        />
        <p className="text-sm text-text-secondary">Divergence score (JSD): {divergence.toFixed(4)}</p>
      </div>

      <div className="panel p-6">
        <div className="h-72 w-full">
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="4 4" stroke="#1c1c2b" />
              <XAxis dataKey="model" stroke="#a1a1aa" />
              <YAxis stroke="#a1a1aa" />
              <Tooltip />
              <Bar dataKey="entropy" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              <Bar dataKey="topProbability" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {models.map((model) => (
          <article key={model.model} className="panel p-4">
            <h2 className="font-mono text-base">{model.model}</h2>
            <p className="mt-2 text-sm text-text-secondary">Top-1 token: {model.topPrediction}</p>
            <p className="text-sm text-text-secondary">
              Top-1 probability: {(model.topProbability * 100).toFixed(2)}%
            </p>
            <p className="text-sm text-text-secondary">Entropy: {model.entropy.toFixed(3)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}


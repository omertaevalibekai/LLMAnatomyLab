"use client";

import { useMemo, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { confidenceByContext } from "@/lib/demo-experiments";

const DEFAULT_TEXT =
  "In long technical prompts, the final prediction often depends on an early constraint";

export default function ContextProbingPage(): JSX.Element {
  const [text, setText] = useState(DEFAULT_TEXT);
  const curve = useMemo(() => confidenceByContext(text), [text]);
  const drops = useMemo(
    () =>
      curve
        .slice(1)
        .map((point, index) => ({
          from: curve[index]?.contextLength ?? 0,
          to: point.contextLength,
          delta: (curve[index]?.confidence ?? 0) - point.confidence,
        }))
        .sort((a, b) => b.delta - a.delta),
    [curve],
  );
  const critical = drops[0];

  return (
    <section className="space-y-4">
      <div className="panel space-y-3 p-6">
        <h1 className="font-mono text-2xl">Experiment 3: Context Window Probing</h1>
        <textarea
          className="w-full rounded-md border border-white/10 bg-bg-primary p-3 text-sm outline-none"
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={3}
        />
      </div>

      <div className="panel p-6">
        <div className="mb-3 text-sm text-text-secondary">
          Confidence of target continuation vs context length
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer>
            <LineChart data={curve}>
              <XAxis dataKey="contextLength" stroke="#a1a1aa" />
              <YAxis stroke="#a1a1aa" domain={[0, 1]} />
              <Tooltip />
              <Line type="monotone" dataKey="confidence" stroke="#3b82f6" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {critical ? (
          <p className="mt-3 text-sm text-text-secondary">
            Largest phase transition: context {critical.from} → {critical.to}, confidence drop{" "}
            {(critical.delta * 100).toFixed(1)}%.
          </p>
        ) : null}
      </div>
    </section>
  );
}


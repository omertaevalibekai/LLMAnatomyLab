"use client";

import { useMemo, useState } from "react";
import { BlockMath } from "react-katex";
import { TemperatureSlider } from "@/components/experiments/TemperatureSlider";

const logits = Array.from({ length: 80 }, (_, i) => Math.cos(i * 0.23) * 1.8 - i * 0.01);
const labels = Array.from({ length: 80 }, (_, i) => `token_${i + 1}`);

export default function TemperatureLabPage(): JSX.Element {
  const [temperature, setTemperature] = useState(0.8);
  const [topK, setTopK] = useState(20);
  const [topP, setTopP] = useState(0.92);

  const summary = useMemo(
    () => `T=${temperature.toFixed(2)} | top-k=${topK} | top-p=${topP.toFixed(2)}`,
    [temperature, topK, topP],
  );

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="font-mono text-3xl">Experiment 6: Temperature & Sampling Dissection</h1>
        <p className="text-text-secondary">
          Visualize how temperature, top-k, and top-p reshape a token probability distribution in
          real time.
        </p>
      </header>

      <section className="rounded-lg bg-bg-secondary p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Control label="Temperature" value={temperature.toFixed(2)}>
            <input
              className="w-full"
              type="range"
              min={0.01}
              max={2}
              step={0.01}
              value={temperature}
              onChange={(event) => setTemperature(Number(event.target.value))}
            />
          </Control>
          <Control label="Top-k" value={String(topK)}>
            <input
              className="w-full"
              type="range"
              min={1}
              max={50}
              step={1}
              value={topK}
              onChange={(event) => setTopK(Number(event.target.value))}
            />
          </Control>
          <Control label="Top-p" value={topP.toFixed(2)}>
            <input
              className="w-full"
              type="range"
              min={0.1}
              max={1}
              step={0.01}
              value={topP}
              onChange={(event) => setTopP(Number(event.target.value))}
            />
          </Control>
        </div>
        <p className="mt-4 font-mono text-sm text-text-secondary">{summary}</p>
      </section>

      <TemperatureSlider
        labels={labels}
        logits={logits}
        temperature={temperature}
        topK={topK}
        topP={topP}
      />

      <section className="rounded-lg bg-bg-secondary p-6 text-text-secondary">
        <BlockMath math={"P(x_i)=\\frac{\\exp(z_i/T)}{\\sum_j\\exp(z_j/T)}"} />
      </section>
    </div>
  );
}

const Control = ({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children: React.ReactNode;
}): JSX.Element => (
  <div>
    <p className="text-sm text-text-secondary">{label}</p>
    <p className="font-mono text-sm text-text-primary">{value}</p>
    <div className="mt-2">{children}</div>
  </div>
);

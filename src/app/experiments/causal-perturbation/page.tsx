"use client";

import { useMemo, useState } from "react";
import { buildLandscape } from "@/lib/demo-experiments";
import { PerturbationType, generatePerturbations } from "@/lib/perturbations";

const DEFAULT_TEXT = "The good model predicts stable answers";

export default function CausalPerturbationPage(): JSX.Element {
  const [text, setText] = useState(DEFAULT_TEXT);
  const [tokenIndex, setTokenIndex] = useState(1);
  const [type, setType] = useState<PerturbationType>("synonym");
  const tokens = useMemo(() => text.trim().split(/\s+/).filter(Boolean), [text]);
  const original = useMemo(() => buildLandscape(text, 6), [text]);
  const perturbation = useMemo(
    () => generatePerturbations(text, Math.max(0, tokenIndex), [type])[0],
    [text, tokenIndex, type],
  );
  const perturbed = useMemo(() => buildLandscape(perturbation?.text ?? text, 6), [perturbation?.text, text]);

  return (
    <section className="space-y-4">
      <div className="panel space-y-3 p-6">
        <h1 className="font-mono text-2xl">Experiment 2: Causal Perturbation Analysis</h1>
        <textarea
          className="w-full rounded-md border border-white/10 bg-bg-primary p-3 text-sm outline-none"
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={3}
        />
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm text-text-secondary">
            Token index
            <select
              className="mt-1 w-full rounded-md bg-bg-primary p-2 text-text-primary"
              value={tokenIndex}
              onChange={(event) => setTokenIndex(Number(event.target.value))}
            >
              {tokens.map((token, index) => (
                <option key={`${token}-${index}`} value={index}>
                  {index}: {token}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-text-secondary">
            Perturbation type
            <select
              className="mt-1 w-full rounded-md bg-bg-primary p-2 text-text-primary"
              value={type}
              onChange={(event) => setType(event.target.value as PerturbationType)}
            >
              {["synonym", "antonym", "delete", "duplicate", "case", "typo"].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="panel p-5">
          <h2 className="mb-2 font-mono text-lg">Original</h2>
          <p className="mb-4 text-sm text-text-secondary">{text}</p>
          <CascadeList label="Token uncertainty" values={original.map((item) => item.candidates[0]?.probability ?? 0)} />
        </div>
        <div className="panel p-5">
          <h2 className="mb-2 font-mono text-lg">Perturbed</h2>
          <p className="mb-4 text-sm text-text-secondary">{perturbation?.text ?? text}</p>
          <CascadeList label="Token uncertainty" values={perturbed.map((item) => item.candidates[0]?.probability ?? 0)} />
        </div>
      </div>
    </section>
  );
}

const CascadeList = ({ label, values }: { label: string; values: number[] }): JSX.Element => (
  <div>
    <p className="mb-2 text-xs uppercase tracking-wide text-text-secondary">{label}</p>
    <div className="space-y-2">
      {values.map((value, index) => (
        <div key={`cascade-${index}`}>
          <div className="mb-1 flex justify-between text-xs text-text-secondary">
            <span>Position {index + 1}</span>
            <span>{(value * 100).toFixed(1)}%</span>
          </div>
          <div className="h-2 rounded bg-bg-tertiary">
            <div
              className="h-full rounded bg-accent-emerald"
              style={{ width: `${Math.max(3, value * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);


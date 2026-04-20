"use client";

import { useMemo, useState } from "react";
import { buildLandscape } from "@/lib/demo-experiments";

const DEFAULT_TEXT = "The keys to the cabinet are on the table";

export default function TokenLandscapePage(): JSX.Element {
  const [text, setText] = useState(DEFAULT_TEXT);
  const [selectedPosition, setSelectedPosition] = useState<number | null>(0);
  const landscape = useMemo(() => buildLandscape(text, 10), [text]);
  const selected = selectedPosition !== null ? landscape[selectedPosition] : undefined;

  return (
    <section className="space-y-4">
      <div className="panel space-y-3 p-6">
        <h1 className="font-mono text-2xl">Experiment 1: Token Probability Landscape</h1>
        <p className="text-sm text-text-secondary">
          Каждая колонка показывает топ-кандидатов следующего токена по позиции.
        </p>
        <textarea
          className="w-full rounded-md border border-white/10 bg-bg-primary p-3 text-sm outline-none"
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={3}
        />
      </div>

      <div className="panel overflow-x-auto p-4">
        <div className="min-w-[900px] space-y-2">
          <div className="grid grid-cols-10 gap-2 text-xs text-text-secondary">
            {Array.from({ length: 10 }, (_, index) => (
              <div key={`header-${index}`} className="text-center">
                cand {index + 1}
              </div>
            ))}
          </div>
          {landscape.map((position) => (
            <button
              type="button"
              key={position.position}
              className={`grid w-full grid-cols-10 gap-2 rounded-md p-2 text-left transition ${
                selectedPosition === position.position ? "bg-bg-tertiary" : "hover:bg-bg-tertiary"
              }`}
              onClick={() => setSelectedPosition(position.position)}
            >
              {position.candidates.map((candidate) => (
                <div
                  key={`${position.position}-${candidate.token}`}
                  className="rounded p-2 text-xs text-text-primary"
                  style={{
                    backgroundColor: `rgba(59,130,246,${Math.min(0.9, candidate.probability * 3 + 0.08)})`,
                  }}
                >
                  <div className="font-mono">{candidate.token}</div>
                  <div className="text-[10px]">{(candidate.probability * 100).toFixed(1)}%</div>
                </div>
              ))}
            </button>
          ))}
        </div>
      </div>

      {selected ? (
        <div className="panel p-6">
          <h2 className="font-mono text-lg">Position {selected.position + 1} details</h2>
          <p className="mb-3 text-sm text-text-secondary">
            Source token: &quot;{selected.sourceToken}&quot;
          </p>
          <div className="space-y-2">
            {selected.candidates.map((candidate) => (
              <div key={candidate.token}>
                <div className="mb-1 flex justify-between text-xs text-text-secondary">
                  <span>{candidate.token}</span>
                  <span>{(candidate.probability * 100).toFixed(2)}%</span>
                </div>
                <div className="h-2 rounded bg-bg-tertiary">
                  <div
                    className="h-full rounded bg-accent-blue"
                    style={{ width: `${Math.max(2, candidate.probability * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}



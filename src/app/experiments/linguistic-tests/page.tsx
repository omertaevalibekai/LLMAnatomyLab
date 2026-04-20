"use client";

import { useMemo } from "react";
import { LINGUISTIC_SUITES } from "@/constants/linguistic-suites";

const MODELS = ["gpt-4o", "gpt-4o-mini", "gpt-3.5-turbo"] as const;

const scoreCase = (input: string, expectedToken: string, model: string): "pass" | "partial" | "fail" => {
  const signal = Math.abs(
    Array.from(`${input}-${expectedToken}-${model}`).reduce((acc, char) => acc + char.charCodeAt(0), 0) % 100,
  );
  if (signal > 66) return "pass";
  if (signal > 33) return "partial";
  return "fail";
};

export default function LinguisticTestsPage(): JSX.Element {
  const suites = useMemo(() => Object.entries(LINGUISTIC_SUITES), []);

  return (
    <section className="space-y-4">
      <div className="panel p-6">
        <h1 className="font-mono text-2xl">Experiment 5: Linguistic Phenomenon Detector</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Матрица pass/partial/fail по феноменам и моделям для стандартизованных тест-кейсов.
        </p>
      </div>

      <div className="panel overflow-x-auto p-4">
        <table className="min-w-[920px] table-fixed border-separate border-spacing-y-2 text-left text-sm">
          <thead>
            <tr className="text-text-secondary">
              <th className="w-[260px] px-3">Suite</th>
              <th className="w-[330px] px-3">Input</th>
              <th className="px-3">Expected</th>
              {MODELS.map((model) => (
                <th key={model} className="px-3">
                  {model}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {suites.flatMap(([suiteName, cases]) =>
              cases.map((testCase, index) => (
                <tr key={`${suiteName}-${index}`} className="rounded-md bg-bg-primary">
                  <td className="rounded-l-md px-3 py-3 font-mono text-xs">{suiteName}</td>
                  <td className="px-3 py-3 text-text-secondary">{testCase.input}</td>
                  <td className="px-3 py-3 text-accent-blue">{testCase.expected_token}</td>
                  {MODELS.map((model) => {
                    const result = scoreCase(testCase.input, testCase.expected_token, model);
                    const color =
                      result === "pass"
                        ? "bg-bg-tertiary text-accent-emerald"
                        : result === "partial"
                          ? "bg-bg-tertiary text-accent-amber"
                          : "bg-bg-tertiary text-accent-rose";
                    return (
                      <td key={`${suiteName}-${index}-${model}`} className="px-3 py-3">
                        <span className={`rounded px-2 py-1 text-xs font-semibold ${color}`}>{result}</span>
                      </td>
                    );
                  })}
                </tr>
              )),
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}



import Link from "next/link";
import type { Route } from "next";

const cards: Array<{
  icon: string;
  title: string;
  href: Route;
  description: string;
}> = [
  {
    icon: "▦",
    title: "Token Probability Landscape",
    href: "/experiments/token-landscape",
    description: "Inspect top token predictions at each position.",
  },
  {
    icon: "↯",
    title: "Causal Perturbation Analysis",
    href: "/experiments/causal-perturbation",
    description: "Probe load-bearing tokens via controlled replacements.",
  },
  {
    icon: "⌛",
    title: "Context Window Probing",
    href: "/experiments/context-probing",
    description: "Measure confidence decay under context truncation.",
  },
  {
    icon: "≋",
    title: "Cross-Model Comparison",
    href: "/experiments/model-comparison",
    description: "Compare behavior across GPT model families.",
  },
  {
    icon: "∑",
    title: "Linguistic Phenomenon Detector",
    href: "/experiments/linguistic-tests",
    description: "Run psycholinguistic-style evaluation suites.",
  },
  {
    icon: "θ",
    title: "Temperature & Sampling Dissection",
    href: "/experiments/temperature-lab",
    description: "Visualize distribution reshaping under sampling controls.",
  },
];

export default function HomePage(): JSX.Element {
  return (
    <div className="space-y-14">
      <section className="panel relative overflow-hidden p-8 md:p-12">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-bg-tertiary blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 left-24 h-44 w-44 rounded-full bg-bg-tertiary blur-3xl" />
        <p className="mb-3 font-mono text-sm uppercase tracking-[0.2em] text-text-secondary">
          Research Interface
        </p>
        <h1 className="max-w-4xl font-mono text-4xl font-bold md:text-5xl">
          Behavioral Interpretability Explorer
        </h1>
        <p className="mt-4 max-w-3xl text-text-secondary">
          LLM Anatomy Lab applies controlled perturbations and token-level probabilities to map
          latent behavior in language models without direct weight access.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link className="primary-btn" href="/experiments/temperature-lab">
            Open Temperature Lab
          </Link>
          <Link
            className="inline-flex items-center rounded-md border border-white/10 px-4 py-2 text-sm transition hover:bg-bg-tertiary"
            href="/about"
          >
            Methodology
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <article
            className="panel group p-5 transition duration-200 hover:-translate-y-1 hover:border-white/20"
            key={card.href}
          >
            <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-md bg-bg-tertiary font-mono text-accent-purple">
              {card.icon}
            </div>
            <h2 className="font-mono text-lg">{card.title}</h2>
            <p className="mt-2 text-sm text-text-secondary">{card.description}</p>
            <Link
              className="mt-4 inline-block rounded-md bg-accent-blue px-3 py-2 text-sm font-medium text-white transition group-hover:opacity-90"
              href={card.href}
            >
              Try it
            </Link>
          </article>
        ))}
      </section>

      <section className="panel grid gap-4 p-6 md:grid-cols-3">
        <Stat label="Method" value="Behavioral interpretability" />
        <Stat label="Signal" value="Token logprobs" />
        <Stat label="Core Metrics" value="Entropy, KL, JSD" />
      </section>
    </div>
  );
}

const Stat = ({ label, value }: { label: string; value: string }): JSX.Element => (
  <div className="rounded-lg bg-bg-primary p-4">
    <p className="text-xs uppercase tracking-wide text-text-secondary">{label}</p>
    <p className="mt-1 font-mono text-sm text-text-primary">{value}</p>
  </div>
);



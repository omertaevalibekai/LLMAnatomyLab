import { BlockMath } from "react-katex";

export default function AboutPage(): JSX.Element {
  return (
    <div className="space-y-6">
      <section className="panel p-8">
        <h1 className="font-mono text-3xl">Behavioral Interpretability Methodology</h1>
        <p className="mt-3 max-w-4xl text-text-secondary">
          This project treats API behavior as an empirical window into model cognition: controlled
          stimuli, measured token probabilities, and systematic perturbations.
        </p>
      </section>

      <section className="panel space-y-4 p-8">
        <h2 className="font-mono text-xl">Mathematical Core</h2>
        <div className="rounded-lg bg-bg-primary p-4 text-text-secondary">
          <BlockMath math={"H(P)=-\\sum_i p_i\\log_2 p_i"} />
        </div>
        <div className="rounded-lg bg-bg-primary p-4 text-text-secondary">
          <BlockMath math={"D_{KL}(P\\|Q)=\\sum_i p_i\\log\\frac{p_i}{q_i}"} />
        </div>
        <div className="rounded-lg bg-bg-primary p-4 text-text-secondary">
          <BlockMath math={"P(x_i)=\\frac{\\exp(z_i/T)}{\\sum_j\\exp(z_j/T)}"} />
        </div>
      </section>

      <section className="panel p-8">
        <h2 className="font-mono text-xl">References</h2>
        <ul className="mt-3 space-y-2 text-text-secondary">
          <li>Language Models as Agent Models (Andreas, 2022)</li>
          <li>Discovering Latent Knowledge in Language Models (Burns et al., 2022)</li>
          <li>Language Models Don&apos;t Always Say What They Think (Turpin et al., 2023)</li>
          <li>Scaling Monosemanticity (Anthropic, 2024)</li>
        </ul>
      </section>
    </div>
  );
}


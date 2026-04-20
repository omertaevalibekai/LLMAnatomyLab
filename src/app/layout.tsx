import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import "katex/dist/katex.min.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "LLM Anatomy Lab",
  description: "Behavioral interpretability explorer via OpenAI logprobs",
};

const NAV_ITEMS: Array<{ href: Route; label: string }> = [
  { href: "/", label: "Home" },
  { href: "/experiments/token-landscape", label: "Experiments" },
  { href: "/experiments/temperature-lab", label: "Temperature Lab" },
  { href: "/about", label: "About" },
];

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <html lang="en" className="dark">
      <body>
        <div className="min-h-screen bg-bg-primary text-text-primary">
          <nav className="sticky top-0 z-30 border-b border-white/10 bg-bg-primary backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
              <Link href="/" className="flex items-center gap-3 font-mono text-sm font-semibold tracking-wide">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-bg-tertiary text-accent-purple">
                  λ
                </span>
                <span>LLM Anatomy Lab</span>
              </Link>
              <div className="flex items-center gap-4 text-sm">
                {NAV_ITEMS.map((item) => (
                  <Link
                    href={item.href}
                    key={item.href}
                    className="rounded-md px-2 py-1 text-text-secondary transition hover:bg-bg-tertiary hover:text-text-primary"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
          <main className="mx-auto w-full max-w-7xl px-6 py-10">{children}</main>
        </div>
      </body>
    </html>
  );
}



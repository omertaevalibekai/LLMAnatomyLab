import katex from "katex";

export function BlockMath({ math }: { math: string }) {
  const html = katex.renderToString(math, {
    displayMode: true,
    throwOnError: false,
    trust: false,
  });
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

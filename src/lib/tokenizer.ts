import { get_encoding } from "tiktoken";

export const tokenize = (input: string): number[] => {
  const encoding = get_encoding("cl100k_base");
  const tokens = encoding.encode(input);
  encoding.free();
  return Array.from(tokens);
};

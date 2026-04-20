export interface LinguisticSuiteCase {
  input: string;
  target_position: number;
  expected_token: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
}

export const LINGUISTIC_SUITES: Record<string, LinguisticSuiteCase[]> = {
  subjectVerbAgreement: [
    {
      input: "The key to the cabinets",
      target_position: 5,
      expected_token: "is",
      category: "agreement",
      difficulty: "easy",
    },
    {
      input: "The keys to the cabinet",
      target_position: 5,
      expected_token: "are",
      category: "agreement",
      difficulty: "easy",
    },
  ],
  gardenPath: [
    {
      input: "The horse raced past the barn",
      target_position: 6,
      expected_token: "fell",
      category: "garden_path",
      difficulty: "hard",
    },
  ],
  negation: [
    {
      input: "The cat is NOT on the",
      target_position: 6,
      expected_token: "mat",
      category: "negation",
      difficulty: "medium",
    },
  ],
  factualRecall: [
    {
      input: "The capital of France is",
      target_position: 5,
      expected_token: "Paris",
      category: "factual",
      difficulty: "easy",
    },
  ],
  multilingualSwitch: [
    {
      input: "I went to the store to",
      target_position: 6,
      expected_token: "buy",
      category: "code_switch",
      difficulty: "medium",
    },
  ],
};

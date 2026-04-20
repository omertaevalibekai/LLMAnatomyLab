import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TokenHeatmap } from "@/components/experiments/TokenHeatmap";

describe("TokenHeatmap", () => {
  it("renders", () => {
    render(React.createElement(TokenHeatmap));
    expect(screen.getByText("TokenHeatmap")).toBeInTheDocument();
  });
});

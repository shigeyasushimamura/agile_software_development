import { expect, vi, describe, it } from "vitest";
import { FeatureGroup, ScoreEvaluator } from "./evaluator.js";

describe("evaluator", () => {
  it("normal evaluate", () => {
    const group = new FeatureGroup("Exam");

    group.addEvaluator(new ScoreEvaluator());
    const m1 = [
      { name: "読解力", score: 92 },
      { name: "構成力", score: 85 },
    ];

    const m2 = [
      { name: "読解力", score: 70 },
      { name: "構成力", score: 60 },
    ];

    group.addMatrixRow(m1);
    group.addMatrixRow(m2);

    const result = group.evaluateAll();
    expect(result).toEqual([
      ["読解力: A", "構成力: B"],
      ["読解力: C", "構成力: D"],
    ]);
  });
});

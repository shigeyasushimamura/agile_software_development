import { expect, vi, describe, it } from "vitest";
import {
  FireBreath,
  HealSkill,
  Goblin,
  SkillReportVisitor,
  visitExtensions,
} from "./ex-and-acyclic-visitor.js";

describe("ex-and-acyclic", () => {
  it("normal", () => {
    // ✅ Example usage
    const goblin = new Goblin();
    goblin.addExtension(new FireBreath());
    goblin.addExtension(new HealSkill());

    const visitor = new SkillReportVisitor();
    visitExtensions(goblin, visitor);

    const report = visitor.getReport();

    expect(report).toEqual(["Fire Breath", "Heal"]);
  });
});

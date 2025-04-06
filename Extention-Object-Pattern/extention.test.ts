import { expect, vi, describe, it } from "vitest";
import { FireBreath, Goblin, HealSkill } from "./extention.js";

describe("extention object", () => {
  it("addExtension", () => {
    const g = new Goblin();
    g.addExtension(new FireBreath());
    g.addExtension(new HealSkill());

    expect(g.getExtension(FireBreath)?.breatheFire()).toBe(
      "🔥 Goblin breathes fire!"
    );
    expect(g.getExtension(HealSkill)?.heal()).toBe("✨ Goblin heals itself!");
  });
});

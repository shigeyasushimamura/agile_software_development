import { expect, vi, describe, it, beforeEach } from "vitest";
import { TestTurnstileController, Turnstile } from "./state.js";

describe("state pattern", () => {
  it("normal", () => {
    const c = new TestTurnstileController();
    const t = new Turnstile(c);
    expect(t.isLocked()).toEqual(true);
    t.pass();
    expect(c.alarmCalled).toEqual(true);
  });
});

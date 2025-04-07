import { expect, vi, describe, it, beforeEach } from "vitest";
import {
  TestTurnstileController,
  Turnstile,
  TurnstileController,
} from "./fsm.js";

describe("fsm", () => {
  let t: Turnstile;
  let c: TestTurnstileController;

  beforeEach(() => {
    c = new TestTurnstileController();
    t = new Turnstile(c);
  });

  it("testInitialConditions", () => {
    expect(t.state).toEqual(Turnstile.LOCKED);
  });

  it("testCoinLockedState", () => {
    t.state = Turnstile.LOCKED;
    t.event(Turnstile.COIN);
    expect(t.state).toEqual(Turnstile.UNLOCKED);
  });

  it("testCoinInUnlockedState", () => {
    t.state = Turnstile.UNLOCKED;
    t.event(Turnstile.COIN);
    expect(t.state).toEqual(Turnstile.UNLOCKED);
    expect(c.thankyouCalled).toBe(true);
  });
});

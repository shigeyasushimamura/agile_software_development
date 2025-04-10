import { describe, it, expect, vi, beforeEach } from "vitest";
import { Event, Turnstile, turnstileController } from "./state2.js";

class MockTurnstileController implements turnstileController {
  lock = vi.fn();
  unlock = vi.fn();
  alarm = vi.fn();
  thankyou = vi.fn();
}

describe("Turnstile State Machine", () => {
  let controller: MockTurnstileController;
  let turnstile: Turnstile;

  beforeEach(() => {
    controller = new MockTurnstileController();
    turnstile = new Turnstile(controller);
  });

  it("コインを入れるとunlockされる", () => {
    turnstile.event(Event.COIN);
    expect(controller.unlock).toHaveBeenCalled();
  });

  it("ロック状態で通過しようとするとalarmが鳴る", () => {
    turnstile.event(Event.PASS);
    expect(controller.alarm).toHaveBeenCalled();
  });

  it("unlock状態で通過するとlockされる", () => {
    turnstile.event(Event.COIN); // Unlock
    turnstile.event(Event.PASS); // Lock again
    expect(controller.lock).toHaveBeenCalled();
  });

  it("unlock状態でさらにコインを入れるとthankyouが呼ばれる", () => {
    turnstile.event(Event.COIN); // Unlock
    turnstile.event(Event.COIN); // Thank you
    expect(controller.thankyou).toHaveBeenCalled();
  });
});

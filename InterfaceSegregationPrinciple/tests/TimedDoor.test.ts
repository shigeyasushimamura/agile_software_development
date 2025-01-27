import { expect, vi, describe, it } from "vitest";
import { TimedDoor } from "../TimedDoor.js";
import { beforeEach } from "node:test";

describe("TimedDoor", () => {
  it("should set a timer and execute timeout after delay", (done) => {
    const timedDoor = new TimedDoor();
    vi.useFakeTimers();
    const lockSpy = vi.spyOn(timedDoor, "lock");
    const delay = 100;

    // タイマーを設定
    const timerId = timedDoor.setTimedLock(delay);
    expect(typeof timerId).toBe("number");

    expect(lockSpy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(delay);

    setImmediate(() => {
      expect(lockSpy).toHaveBeenCalled();
      done;
    });

    vi.useRealTimers();
  });

  it("should clear a specific timer", () => {
    const timedDoor = new TimedDoor();
    vi.useFakeTimers();

    const lockSpy = vi.spyOn(timedDoor, "lock");
    const delay = 100;

    const timerId = timedDoor.setTimedLock(delay);
    expect(typeof timerId).toBe("number");

    expect(lockSpy).not.toHaveBeenCalled();

    timedDoor.clearTimedLock(timerId);
    vi.advanceTimersByTime(delay);

    expect(lockSpy).not.toHaveBeenCalled();

    vi.useRealTimers();
  });
});

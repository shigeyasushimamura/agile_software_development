import { expect, vi, describe, it } from "vitest";
import { AlarmClock, TemperatureSensor } from "./alarmclock.js";

describe("case study2", () => {
  it("alarmclock anonymos class test", () => {
    vi.useFakeTimers(); // 仮想タイマーを使う
    const clock = new AlarmClock();
    const sensor = new TemperatureSensor(clock);

    const spy = vi.spyOn(console, "log");
    // タイマーを1秒分進める
    vi.advanceTimersByTime(1000);

    setTimeout(() => clock.stopAll(), 5000);
    expect(spy).toHaveBeenCalledWith("temperature sensor activate");
    spy.mockRestore();
  });
});

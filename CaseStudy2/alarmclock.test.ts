import { expect, vi, describe, it, beforeEach, afterEach } from "vitest";
import { TemperatureSensor } from "./alarmclock.js";
import {
  AlarmClock,
  ClockListener,
  Nimbus1AlarmClock,
  Nimbus1Toolkit,
} from "./alarmclock2.js";

// describe("case study2", () => {
//   it("alarmclock anonymos class test", () => {
//     vi.useFakeTimers(); // 仮想タイマーを使う
//     const clock = new AlarmClock();
//     // const sensor = new TemperatureSensor(clock);

//     // const spy = vi.spyOn(console, "log");
//     // // タイマーを1秒分進める
//     // vi.advanceTimersByTime(1000);

//     // setTimeout(() => clock.stopAll(), 5000);
//     // expect(spy).toHaveBeenCalledWith("temperature sensor activate");
//     // spy.mockRestore();
//   });

// });
describe("AlarmClock with Nimbus1Toolkit", () => {
  let clock: AlarmClock;
  let toolkit: Nimbus1Toolkit;

  beforeEach(() => {
    vi.useFakeTimers(); // 時間をモック
    toolkit = new Nimbus1Toolkit();
    clock = new AlarmClock(toolkit);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should call tic() on registered ClockListener every second", () => {
    const aci = toolkit.getAlarmClock() as Nimbus1AlarmClock;
    const listener: ClockListener = {
      tic: vi.fn(),
    };

    clock.register(listener);
    aci.start(); // ← ここ重要！

    vi.advanceTimersByTime(3500);

    expect(listener.tic).toHaveBeenCalledTimes(3);
  });

  it("should not call tic() before time has advanced", () => {
    const listener: ClockListener = {
      tic: vi.fn(),
    };

    clock.register(listener);

    // 時間を進めない
    expect(listener.tic).not.toHaveBeenCalled();
  });
});

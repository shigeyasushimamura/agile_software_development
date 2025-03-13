import { expect, vi, describe, it } from "vitest";
import { MockTimerSource, MockTimeSink } from "./observer.js";

describe("observer pattern", () => {
  it("normal", () => {
    const source = new MockTimerSource();
    const sink = new MockTimeSink(source);
    source.registerObserver(sink);
    const sink2 = new MockTimeSink(source);
    source.registerObserver(sink2);

    source.setTime(1, 2, 4);
    expect(sink.getHours()).toBe(1);
    expect(sink.getMinutes()).toBe(2);

    expect(sink2.getHours()).toBe(1);
    expect(sink2.getMinutes()).toBe(2);
  });
});

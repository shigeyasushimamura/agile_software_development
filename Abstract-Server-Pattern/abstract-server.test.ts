import { expect, vi, describe, it } from "vitest";
import { FanSwitch, Light, Switch } from "./abstract-server.js";

describe("abstract server", () => {
  it("normal", () => {
    const s = new Switch();

    const spy2 = vi.spyOn(console, "log");

    s.on();
    s.off();

    expect(spy2).toHaveBeenCalledWith("lighton");
    expect(spy2).toHaveBeenCalledWith("lightoff");
  });

  it("normal2", () => {
    const s = new FanSwitch();

    const spy2 = vi.spyOn(console, "log");

    s.on();
    s.off();

    expect(spy2).toHaveBeenCalledWith("fanon");
    expect(spy2).toHaveBeenCalledWith("fanoff");
  });
});

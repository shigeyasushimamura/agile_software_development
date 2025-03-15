import { expect, vi, describe, it } from "vitest";
import {
  ConcreteDedicatedModem,
  DedicatedModemAdapter,
  DedUser,
} from "./adapter.js";

describe("adapter pattern", () => {
  it("adapter should simulate dial and hangup", () => {
    const dedicatedModem = new ConcreteDedicatedModem();
    const adapter = new DedicatedModemAdapter(dedicatedModem);

    const spy = vi.spyOn(console, "log");

    adapter.dial();
    adapter.hangup();

    expect(spy).toHaveBeenCalledWith("Simulating dial connection...");
    expect(spy).toHaveBeenCalledWith("Simulating hangup connection...");

    spy.mockRestore();
  });

  describe("adapter pattern", () => {
    it("normal", () => {
      const dedicatedModem = new ConcreteDedicatedModem();
      const adapter = new DedicatedModemAdapter(dedicatedModem);
      const user = new DedUser(adapter);

      const spy = vi.spyOn(console, "log");

      user.send();
      user.receive();

      expect(spy).toHaveBeenCalledWith("send");
      expect(spy).toHaveBeenCalledWith("receive");

      spy.mockRestore();
    });
  });
});

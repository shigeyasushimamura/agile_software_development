import { Button } from "../button.js";
import { expect, it, vi, describe } from "vitest";

describe("Button", () => {
  it("btn switch", () => {
    const btn = new Button();

    const lampOnMock = vi.spyOn(btn.switchableServer, "turnOn");
    const lampOffMock = vi.spyOn(btn.switchableServer, "turnOff");

    btn.poll();
    btn.poll();

    expect(lampOffMock).toHaveBeenCalledBefore(lampOnMock);
    // expect(lampOffMock).toHaveBeenCalled();
  });
});

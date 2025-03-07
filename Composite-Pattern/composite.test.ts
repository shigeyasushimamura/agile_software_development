import { expect, vi, describe, it } from "vitest";
import { Circle, CompositeShape, Triangle } from "./composite.js";

describe("composite-pattern", () => {
  it("normal", () => {
    const tri = new Triangle();
    const cir = new Circle();

    const comp = new CompositeShape();

    comp.add(tri);
    comp.add(cir);

    const spy = vi.spyOn(console, "log");

    comp.draw();

    expect(spy).toHaveBeenCalledWith("triangle");
    expect(spy).toHaveBeenCalledWith("circle");
  });
});

import { expect, describe, it, vi } from "vitest";
import {
  AShape,
  Circle,
  DrawingTool,
  Square,
  Triangle,
} from "../drawingTool.js";

describe("drawingtool", () => {
  it("sample", () => {
    const a = 1;
    expect(a).toEqual(1);
  });

  it("MixedCreateTest", () => {
    const square = new Square(1);
    const circle = new Circle(1, 1);

    let drawList = new Array<AShape>();
    drawList.push(square);
    drawList.push(circle);

    const squareDrawSpy = vi.spyOn(square, "draw");
    const circleDrawSpy = vi.spyOn(circle, "draw");

    DrawingTool.drawAllShapes(drawList);

    expect(squareDrawSpy).toHaveBeenCalledTimes(1);
    expect(circleDrawSpy).toHaveBeenCalledTimes(1);
  });

  it("circle should be written before square", () => {
    const square = new Square(1);
    const circle = new Circle(1, 1);
    const triangle = new Triangle(1);

    let drawList = new Array<AShape>();
    drawList.push(triangle);
    drawList.push(square);
    drawList.push(circle);

    const squareDrawSpy = vi.spyOn(square, "draw");
    const circleDrawSpy = vi.spyOn(circle, "draw");
    const triangleDrawSpy = vi.spyOn(triangle, "draw");

    DrawingTool.drawAllShapes(drawList);

    expect(circleDrawSpy).toHaveBeenCalledBefore(squareDrawSpy);
    expect(circleDrawSpy).toHaveBeenCalledBefore(triangleDrawSpy);
  });
});

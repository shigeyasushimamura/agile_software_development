import { expect, describe, it, vi } from "vitest";
import {
  BubbleSorterStrategy,
  IntSortHandleStrategy,
} from "../bubbleSorter.js";

describe("strategy", () => {
  it("intsort normal", () => {
    const bubbleSort = new IntSortHandleStrategy();
    const sortStrategy = new BubbleSorterStrategy(bubbleSort);

    const result = sortStrategy.sort([3, 4, 5, 2, 1]);
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });
});

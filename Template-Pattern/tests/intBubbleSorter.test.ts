import { expect, vi, describe, it } from "vitest";
import { BubbleSorter } from "../bubbleSorter.js";
import { IntBubbleSorter } from "../intBubbleSorter.js";

describe("intBubbleSorter", () => {
  // let sorter:BubbleSorter

  it("normal", () => {
    let sorter = new IntBubbleSorter();
    const array = [5, 4, 3, 2, 1];

    const result = sorter.sort(array);
    console.log("result:", result);
  });
});

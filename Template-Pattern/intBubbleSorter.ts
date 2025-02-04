import { BubbleSorter } from "./bubbleSorter.js";

export class IntBubbleSorter extends BubbleSorter {
  private array: number[] = [];
  public sort(theArray: number[]): number[] {
    this.array = theArray;
    this.length = this.array.length;
    this.doSort();

    return this.array;
  }

  protected swap(index: number) {
    let temp = this.array[index];
    this.array[index] = this.array[index + 1];
    this.array[index + 1] = temp;
  }

  protected outOfOrder(index: number): boolean {
    return this.array[index] > this.array[index + 1];
  }
}

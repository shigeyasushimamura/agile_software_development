export interface SortHandle {
  swap(index: number): void;
  outOfOrder(index: number): boolean;
  length(): number;
  setArray(array: number[]): void;
  getArray(): number[];
}

export class BubbleSorterStrategy {
  private operations = 0;
  private length = 0;
  private itsSortHandle: SortHandle | null = null;
  constructor(handle: SortHandle) {
    this.itsSortHandle = handle;
  }
  public sort(array: number[]): number[] {
    this.itsSortHandle?.setArray(array);
    this.length = this.itsSortHandle?.length() ?? 0;
    this.operations = 0;
    if (this.length <= 1) {
      // return this.operations;
      return [];
    }
    for (let nextToLast = this.length - 2; nextToLast >= 0; nextToLast--) {
      for (let index = 0; index <= nextToLast; index++) {
        if (this.itsSortHandle?.outOfOrder(index)) {
          this.itsSortHandle.swap(index);
        }
        this.operations++;
      }
    }
    // return this.operations;
    return this.itsSortHandle?.getArray() ?? [];
  }
}

export class IntSortHandleStrategy implements SortHandle {
  private array: number[] = [];
  public swap(index: number): void {
    let temp = this.array[index];
    this.array[index] = this.array[index + 1];
    this.array[index + 1] = temp;
  }

  public setArray(array: number[]) {
    this.array = array;
  }
  public length(): number {
    return this.array.length;
  }
  outOfOrder(index: number): boolean {
    return this.array[index] > this.array[index + 1];
  }
  getArray(): number[] {
    return this.array;
  }
}

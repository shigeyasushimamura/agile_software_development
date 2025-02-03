export abstract class BubbleSorter {
  private operations: number = 0;
  protected length = 0;
  protected doSort() {
    this.operations = 0;
    if (this.length <= 1) {
      return this.operations;
    }
    for (let nextToLast = this.length - 2; nextToLast >= 0; nextToLast--) {
      for (let index = 0; index <= nextToLast; index++) {
        if (this.outOfOrder(index)) {
          this.swap(index);
        }
        this.operations++;
      }
    }
    return this.operations;
  }
  protected abstract swap(index: number): void;
  protected abstract outOfOrder(index: number): boolean;
}

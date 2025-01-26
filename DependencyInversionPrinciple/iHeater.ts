export abstract class IHeater {
  constructor(protected isEngaged: boolean) {}

  abstract engage(): void;

  abstract disengage(): void;

  getIsEngage(): boolean {
    return this.isEngaged;
  }
}

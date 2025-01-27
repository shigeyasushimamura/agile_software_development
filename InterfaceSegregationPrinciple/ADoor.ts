export abstract class ADoor {
  constructor() {}

  abstract lock(): void;
  abstract unLock(): void;
  abstract isDoorOpen(): boolean;
}

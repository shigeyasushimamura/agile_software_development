import { IHeater } from "./iHeater.js";

export class Heater extends IHeater {
  constructor(isEngaged = true) {
    super(isEngaged);
  }

  engage(): void {
    this.isEngaged = true;
  }

  disengage(): void {
    this.isEngaged = false;
  }
}

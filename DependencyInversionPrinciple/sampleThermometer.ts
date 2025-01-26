import { IThermometer } from "./iThermometer.js";

export class SampleThermometer extends IThermometer {
  constructor(t: number) {
    super(t);
  }

  getTemperature(): number {
    return this.t;
  }
}

import { IHeater } from "./iHeater.js";
import { IThermometer } from "./iThermometer.js";

export class HeaterController {
  constructor(private isEngage = true) {}

  getIsEngage(): boolean {
    return this.isEngage;
  }

  switchIsEngage(): void {
    this.isEngage = !this.isEngage;
  }

  static async regulate(
    t: IThermometer,
    h: IHeater,
    minTemp: number,
    maxTemp: number
  ) {
    if (h.getIsEngage()) {
      while (t.getTemperature() < maxTemp) {
        console.log(t.getTemperature());
        console.log("max:", maxTemp);
        await this.wait();
      }
      h.disengage();
    } else {
      while (t.getTemperature() > minTemp) {
        await this.wait();
      }
      h.engage();
    }
  }

  static wait(ms = 1000) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

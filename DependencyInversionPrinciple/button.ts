import { Lamp } from "./Lamp.js";
import { ISwitchable } from "./SwitchableInterface.js";

export class Button {
  constructor(private isOn = true) {}

  switchableServer = new Lamp();

  poll(): void {
    if (this.isOn) {
      this.switchableServer.turnOff();
    } else {
      this.switchableServer.turnOn();
    }
    this.switchIsOn();
  }

  getIsOn() {
    return this.isOn;
  }

  switchIsOn(): void {
    this.isOn = !this.isOn;
  }
}

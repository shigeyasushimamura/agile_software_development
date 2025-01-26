import { ISwitchable } from "./SwitchableInterface.js";

export class Lamp extends ISwitchable {
  constructor() {
    super();
  }

  turnOn(): void {}
  turnOff(): void {}
}

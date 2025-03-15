export class Switch {
  protected itsSwitchable: Switchable = new Light();

  on() {
    this.itsSwitchable.turnOn();
  }
  off() {
    this.itsSwitchable.turnOff();
  }
}

export class FanSwitch extends Switch {
  constructor() {
    super();
    this.itsSwitchable = new Fan();
  }
}

export abstract class Switchable {
  abstract turnOn(): void;
  abstract turnOff(): void;
}

export class Light extends Switchable {
  turnOn(): void {
    console.log("lighton");
  }
  turnOff(): void {
    console.log("lightoff");
  }
}

export class Fan extends Switchable {
  turnOn(): void {
    console.log("fanon");
  }
  turnOff(): void {
    console.log("fanoff");
  }
}

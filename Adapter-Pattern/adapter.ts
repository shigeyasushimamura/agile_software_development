export interface Modem {
  dial(): void;
  hangup(): void;
  send(): void;
  receive(): void;
}

export class DedicatedModemAdapter implements Modem {
  private itsDedicatedModem: DedicatedModem;

  constructor(dedicatedModem: DedicatedModem) {
    this.itsDedicatedModem = dedicatedModem;
  }

  dial(): void {
    console.log("Simulating dial connection...");
  }

  hangup(): void {
    console.log("Simulating hangup connection...");
  }

  send(): void {
    this.itsDedicatedModem.send();
  }

  receive(): void {
    this.itsDedicatedModem.receive();
  }
}

export interface DedicatedModem {
  send(): void;
  receive(): void;
}

export class ConcreteDedicatedModem implements DedicatedModem {
  send(): void {
    console.log("send");
  }

  receive(): void {
    console.log("receive");
  }
}

export class DedUser {
  private modem: Modem;

  constructor(modem: Modem) {
    this.modem = modem;
  }

  send(): void {
    this.modem.send();
  }

  receive(): void {
    this.modem.receive();
  }
}

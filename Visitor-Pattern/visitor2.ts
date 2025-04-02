export interface Modem {
  dial(pno: String): void;
  hangup(): void;
  send(c: String): void;
  recv(): String;
  accept(v: ModemVisitor): void;
}

export interface ModemVisitor {}

export interface HayesModemVisitor extends ModemVisitor {
  visit(modem: HayesModem): void;
}

export interface ZoomModemVisitor extends ModemVisitor {
  visit(modem: ZoomModem): void;
}

export interface ErieModemVisitor extends ModemVisitor {
  visit(modem: ErieModem): void;
}

export class HayesModem implements Modem {
  public configurationString: string = "";

  dial(pno: string): void {}
  hangup(): void {}
  send(c: string): void {}
  recv(): string {
    return "0";
  }

  accept(v: ModemVisitor): void {
    if ("visit" in v && typeof (v as HayesModemVisitor).visit === "function") {
      (v as HayesModemVisitor).visit(this);
    }
  }
}

export class ZoomModem implements Modem {
  public configurationValue: number = 0;
  dial(pno: String): void {}
  hangup(): void {}
  send(c: String): void {}
  recv(): String {
    return "0";
  }
  accept(v: ModemVisitor): void {
    if ("visit" in v && typeof (v as ZoomModemVisitor).visit === "function") {
      (v as ZoomModemVisitor).visit(this);
    }
  }
}

export class ErieModem implements Modem {
  public internalPattern: String = "";
  dial(pno: String): void {}
  hangup(): void {}
  send(c: String): void {}
  recv(): String {
    return "0";
  }
  accept(v: ModemVisitor): void {
    if ("visit" in v && typeof (v as ErieModemVisitor).visit === "function") {
      (v as ErieModemVisitor).visit(this);
    }
  }
}

export class UnixModemConfigurator
  implements HayesModemVisitor, ZoomModemVisitor, ErieModemVisitor
{
  visit(modem: HayesModem): void;
  visit(modem: ZoomModem): void;
  visit(modem: ErieModem): void;
  visit(modem: HayesModem | ZoomModem | ErieModem): void {
    if (modem instanceof HayesModem) {
      modem.configurationString = "&s1=4&D=3";
    } else if (modem instanceof ZoomModem) {
      modem.configurationValue = 42;
    } else if (modem instanceof ErieModem) {
      modem.internalPattern = "C is too slow";
    }
  }
}

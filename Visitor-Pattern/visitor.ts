export interface Modem {
  dial(pno: String): void;
  hangup(): void;
  send(c: String): void;
  recv(): String;
  accept(v: ModemVisitor): void;
}

export interface ModemVisitor {
  visit(modem: HayesModem): void;
  visit(modem: ZoomModem): void;
  visit(modem: ErieModem): void;
  visit(modem: Modem): void;
}

export class HayesModem implements Modem {
  public configurationString: String = "";
  dial(pno: String): void {}
  hangup(): void {}
  send(c: String): void {}
  recv(): String {
    return "0";
  }
  accept(v: ModemVisitor): void {
    v.visit(this);
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
    v.visit(this);
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
    v.visit(this);
  }
}

export class UnixModemConfigurator implements ModemVisitor {
  visit(modem: HayesModem): void;
  visit(modem: ZoomModem): void;
  visit(modem: ErieModem): void;
  visit(modem: Modem): void {
    if (modem instanceof HayesModem) {
      modem.configurationString = "&s1=4&D=3";
    } else if (modem instanceof ZoomModem) {
      modem.configurationValue = 42;
    } else if (modem instanceof ErieModem) {
      modem.internalPattern = "C is too slow";
    }
  }
}

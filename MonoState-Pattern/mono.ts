export class Turnstile {
  private static locked: boolean;
  private static alarming: boolean;
  protected static LOCKED: Locked;
  protected static UNLOCKED: UnLocked;
  protected static itsState: Turnstile;
  private static itsRefund: number;

  constructor() {}

  reset() {
    Turnstile.initializeStates();
  }

  // 静的プロパティの初期化
  static initializeStates() {
    Turnstile.locked = true;
    Turnstile.alarming = false;
    Turnstile.LOCKED = new Locked();
    Turnstile.UNLOCKED = new UnLocked();
    Turnstile.itsState = Turnstile.LOCKED; // 初期状態をLockedに
    Turnstile.itsRefund = 0;
  }

  isLocked() {
    return Turnstile.locked;
  }

  isAlarming() {
    return Turnstile.alarming;
  }

  coin() {
    Turnstile.itsState.coin();
  }

  pass() {
    Turnstile.itsState.pass();
  }

  setLocked(locked: boolean) {
    Turnstile.locked = locked;
  }

  setAlarming(alarming: boolean) {
    Turnstile.alarming = alarming;
  }

  refund() {
    Turnstile.itsRefund++;
  }

  getRefund() {
    return Turnstile.itsRefund;
  }
}

export class Locked extends Turnstile {
  coin() {
    Turnstile.itsState = Turnstile.UNLOCKED;
    this.setLocked(false);
    this.setAlarming(false);
  }
  pass() {
    this.setAlarming(true);
  }
}

export class UnLocked extends Turnstile {
  coin() {
    // console.log(this.getRefund());
    this.refund();
  }
  pass() {
    Turnstile.itsState = Turnstile.LOCKED;
    this.setLocked(true);
    this.setAlarming(false);
  }
}

Turnstile.initializeStates();

export interface TurnstileState {
  coin(t: Turnstile): void;
  pass(t: Turnstile): void;
}

export class LockedTurnstileState implements TurnstileState {
  coin(t: Turnstile) {
    t.setUnlocked();
    t.unlock();
  }
  pass(t: Turnstile): void {
    t.alarm();
  }
}
export class UnlockedTurnstileState implements TurnstileState {
  coin(t: Turnstile): void {
    t.thankyou();
  }
  pass(t: Turnstile): void {
    t.setLocked();
    t.lock();
  }
}

export class Turnstile {
  static lockedState = new LockedTurnstileState();
  static unlockedState = new UnlockedTurnstileState();
  private c?: TurnstileController;
  private state = Turnstile.lockedState;

  constructor(controller: TurnstileController) {
    this.c = controller;
  }

  coin() {
    this.state.coin(this);
  }
  pass() {
    this.state.pass(this);
  }
  setLocked() {
    this.state = Turnstile.lockedState;
  }

  setUnlocked() {
    this.state = Turnstile.unlockedState;
  }

  isLocked() {
    return this.state === Turnstile.lockedState;
  }

  isUnlocked() {
    return this.state === Turnstile.unlockedState;
  }

  lock(): void {
    this.c?.lock();
  }

  unlock(): void {
    this.c?.unlock();
  }

  thankyou(): void {
    this.c?.thankyou();
  }

  alarm(): void {
    this.c?.alarm();
  }
}

export interface TurnstileController {
  lock(): void;
  unlock(): void;
  thankyou(): void;
  alarm(): void;
}

export class TestTurnstileController implements TurnstileController {
  public lockCalled = false;
  public unlockCalled = false;
  public thankyouCalled = false;
  public alarmCalled = false;

  lock(): void {
    this.lockCalled = true;
  }

  unlock(): void {
    this.unlockCalled = true;
  }

  thankyou(): void {
    this.thankyouCalled = true;
  }

  alarm(): void {
    this.alarmCalled = true;
  }
}

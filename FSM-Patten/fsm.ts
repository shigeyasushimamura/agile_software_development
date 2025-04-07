export class Turnstile {
  public static LOCKED = 0;
  public static UNLOCKED = 1;
  public static COIN = 0;
  public static PASS = 1;
  public state = Turnstile.LOCKED;
  public turnstileController?: TurnstileController;

  constructor(action: TurnstileController) {
    this.turnstileController = action;
  }

  event(event: number): void {
    switch (this.state) {
      case Turnstile.LOCKED:
        switch (event) {
          case Turnstile.COIN:
            this.state = Turnstile.UNLOCKED;
            this.turnstileController?.unlock();
            break;
          case Turnstile.PASS:
            this.turnstileController?.alarm();
            break;
        }
        break;
      case Turnstile.UNLOCKED:
        switch (event) {
          case Turnstile.COIN:
            this.state = Turnstile.UNLOCKED;
            this.turnstileController?.thankyou();
            break;
          case Turnstile.PASS:
            this.turnstileController?.lock();
            break;
        }
    }
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

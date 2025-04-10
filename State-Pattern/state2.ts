export interface turnstileController {
  lock(): void;
  unlock(): void;
  alarm(): void;
  thankyou(): void;
}

export enum State {
  LOCKED = 0,
  UNLOCKED = 1,
}

export enum Event {
  COIN = 0,
  PASS = 1,
}

type Action = () => void;

class Transition {
  constructor(
    public currentState: number,
    public event: number,
    public newState: number,
    public action: Action
  ) {}
}

export class Turnstile {
  private state: number = State.LOCKED;
  private transition: Transition[] = [];

  constructor(private turnstileController: turnstileController) {
    this.addTransition(State.LOCKED, Event.COIN, State.UNLOCKED, this.unlock());
    this.addTransition(State.LOCKED, Event.PASS, State.LOCKED, this.alarm());
    this.addTransition(
      State.UNLOCKED,
      Event.COIN,
      State.UNLOCKED,
      this.thankyou()
    );
    this.addTransition(State.UNLOCKED, Event.PASS, State.LOCKED, this.lock());
  }

  private addTransition(
    currentState: number,
    event: number,
    newState: number,
    action: Action
  ) {
    this.transition.push(new Transition(currentState, event, newState, action));
  }

  private lock(): Action {
    return () => this.turnstileController.lock();
  }

  private unlock(): Action {
    return () => this.turnstileController.unlock();
  }

  private alarm(): Action {
    return () => this.turnstileController.alarm();
  }

  private thankyou(): Action {
    return () => this.turnstileController.thankyou();
  }

  public event(event: number) {
    for (const transition of this.transition) {
      if (
        this.state === transition.currentState &&
        event === transition.event
      ) {
        this.state = transition.newState;
        transition.action();
        break;
      }
    }
  }
}

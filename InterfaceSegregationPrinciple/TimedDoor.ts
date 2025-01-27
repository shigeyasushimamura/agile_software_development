import { ADoor } from "./ADoor.js";
import { ITimer } from "./ITimer.js";
import { Timer } from "./Timer.js";

export class TimedDoor extends ADoor implements ITimer {
  private timer: Timer;
  private isOpen: boolean = false;
  constructor() {
    super();
    this.timer = new Timer();
  }

  lock(): void {
    console.log("Door is locked");
  }

  unLock(): void {
    console.log("Door is unLocked");
  }

  isDoorOpen(): boolean {
    return this.isOpen;
  }

  timeOut(timeOutId: number): void {
    console.log(`Timer with ID ${timeOutId} triggerrd`);
    this.lock();
  }

  // Set a timer to lock the door after a specified delay
  setTimedLock(delay: number): number {
    console.log(`Setting a timer to lock the door in ${delay}ms.`);
    const timerId = this.timer.setTimer(() => this.timeOut(timerId), delay);
    return timerId;
  }

  // Clear a specific timer
  clearTimedLock(timerId: number): void {
    console.log(`Clearing timer with ID ${timerId}.`);
    this.timer.clearTimer(timerId);
  }
}

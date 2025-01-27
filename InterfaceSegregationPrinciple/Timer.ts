import { ITimer } from "./ITimer.js";

export class Timer {
  private timers: Map<number, NodeJS.Timeout> = new Map();

  // Start a timer and return its ID
  setTimer(callback: () => void, delay: number): number {
    const id = Date.now(); // Unique ID based on timestamp
    const timeoutId = setTimeout(() => {
      callback();
      this.clearTimer(id); // Auto-remove once executed
    }, delay);
    this.timers.set(id, timeoutId);
    console.log("id:", id);
    return id;
  }

  // Clear a specific timer
  clearTimer(id: number): void {
    const timeoutId = this.timers.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.timers.delete(id);
    }
  }

  // Clear all timers
  clearAllTimers(): void {
    this.timers.forEach((timeoutId) => clearTimeout(timeoutId));
    this.timers.clear();
  }
}

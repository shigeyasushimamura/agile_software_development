export interface TimeSource {
  // registerObserver(driver: ClockObserver): void;
  getHours(): number;
  getMinutes(): number;
  getSeconds(): number;
}

// export class TimeSource {
//   itsObserverList: Array<ClockObserver> = [];
//   // notify:リストに対して、通知
//   notify(hours: number, minutes: number, seconds: number) {
//     for (const o of this.itsObserverList) {
//       o.update(hours, minutes, seconds);
//     }
//   }
//   registerObserver(driver: ClockObserver): void {
//     this.itsObserverList.push(driver);
//   }
// }

export interface Observer {
  update(): void;
}

export class Subject {
  itsObserverList: Array<Observer> = [];
  notifyObserver() {
    for (const o of this.itsObserverList) {
      o.update();
    }
  }
  registerObserver(o: Observer): void {
    this.itsObserverList.push(o);
  }
}

export class MockTimerSource extends Subject implements TimeSource {
  private itsHours: number = 0;
  private itsMinutes: number = 0;
  private itsSeconds: number = 0;

  getHours() {
    return this.itsHours;
  }
  getMinutes() {
    return this.itsMinutes;
  }
  getSeconds() {
    return this.itsSeconds;
  }

  setTime(hours: number, minutes: number, seconds: number) {
    this.itsHours = hours;
    this.itsMinutes = minutes;
    this.itsSeconds = seconds;
    this.notifyObserver();
  }
}

// export class TimeSourceImplementation {
//   itsObserverList: Array<ClockObserver> = [];
//   // notify:リストに対して、通知
//   notify(hours: number, minutes: number, seconds: number) {
//     for (const o of this.itsObserverList) {
//       o.update(hours, minutes, seconds);
//     }
//   }
//   registerObserver(driver: ClockObserver): void {
//     this.itsObserverList.push(driver);
//   }
// }

// export interface ClockObserver {
//   update(hours: number, minutes: number, seconds: number): void;
// }

export class MockTimeSink implements Observer {
  private itsHours: number | undefined = 0;
  private itsMinutes: number | undefined = 0;
  private itsSeconds: number | undefined = 0;
  private itsSource: TimeSource | undefined = undefined;

  constructor(source: TimeSource) {
    this.itsSource = source;
  }

  getHours() {
    return this.itsHours;
  }
  getMinutes() {
    return this.itsMinutes;
  }
  getSeconds() {
    return this.itsSeconds;
  }
  update(): void {
    this.itsHours = this.itsSource?.getHours();
    this.itsMinutes = this.itsSource?.getMinutes();
    this.itsSeconds = this.itsSource?.getSeconds();
  }
}

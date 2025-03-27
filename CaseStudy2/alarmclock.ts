export interface AlarmListener {
  wakeup(): void;
}

export class AlarmClock {
  private timers: ReturnType<typeof setInterval>[] = [];

  wakeEvery(intervalMs: number, listener: AlarmListener): void {
    const timer = setInterval(() => {
      listener.wakeup();
    }, intervalMs);
    this.timers.push(timer);
  }

  stopAll(): void {
    this.timers.forEach(clearInterval);
  }
}

export interface Observer<T> {
  update(value: T): void;
}

export class Observable<T> {
  private observers: Observer<T>[] = [];
  addObserver(observer: Observer<T>) {
    this.observers.push(observer);
  }
  notifyObservers(value: T) {
    for (const observer of this.observers) {
      observer.update(value);
    }
  }
}

export abstract class TemperatureSensor
  extends Observable<number>
  implements AlarmListener
{
  private itsLastReading: number = NaN;
  wakeup(): void {
    this.check();
  }
  private check() {
    const val = this.read();
    if (val !== this.itsLastReading) {
      this.itsLastReading = val;
      this.notifyObservers(val);
    }
  }
  protected abstract read(): number;
}

export class NimbusTemperatureSensor extends TemperatureSensor {
  protected read(): number {
    // 仮のネイティブ呼び出し
    return Math.floor(Math.random() * 100); // 例: ランダム温度
  }
}

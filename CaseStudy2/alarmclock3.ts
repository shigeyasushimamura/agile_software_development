export interface HiLoData {
  currentReading(value: number, time: number): void;
  newDay(initial: number, time: number): void;
  getHighValue(): number;
  getHighTime(): number;
  getLowValue(): number;
  getLowTime(): number;
}

export class HiLoDataImp implements HiLoData {
  private highValue = Number.NEGATIVE_INFINITY;
  private highTime = 0;
  private lowValue = Number.POSITIVE_INFINITY;
  private lowTime = 0;

  currentReading(value: number, time: number): void {
    if (value > this.highValue) {
      this.highValue = value;
      this.highTime = time;
    }
    if (value < this.lowValue) {
      this.lowValue = value;
      this.lowTime = time;
    }
  }

  newDay(initial: number, time: number): void {
    this.highValue = initial;
    this.lowValue = initial;
    this.highTime = time;
    this.lowTime = time;
  }

  getHighValue(): number {
    return this.highValue;
  }

  getHighTime(): number {
    return this.highTime;
  }

  getLowValue(): number {
    return this.lowValue;
  }

  getLowTime(): number {
    return this.lowTime;
  }
}

export interface Observer {
  update(value: number, time: number): void;
}

export class TemperatureSensor {
  private observers: Observer[] = [];
  private tempValue: number = 0;

  addObserver(observer: Observer): void {
    this.observers.push(observer);
  }

  changeTemperature(value: number, time: number): void {
    for (const observer of this.observers) {
      observer.update(value, time);
    }
  }

  update() {
    this.tempValue = Math.random() * 100;
    this.changeTemperature(this.tempValue, 20250101);
  }

  read() {
    const t = Math.random() * 100;
    this.tempValue = t;
    return this.tempValue;
  }
}

export interface AlarmListener {
  wakeUp(): void;
  read(): void;
}

export class AlarmClock {
  private listeners: AlarmListener[] = [];

  wakeEveryDay(listener: AlarmListener): void {
    this.listeners.push(listener);
  }

  triggerMidnight(): void {
    for (const listener of this.listeners) {
      listener.wakeUp();
    }
  }

  wakeup() {
    for (const listener of this.listeners) {
      listener.read();
    }
  }
}

export class TemperatureHiLo implements Observer, AlarmListener {
  private data: HiLoData;
  private clock?: AlarmClock;
  private sensor?: TemperatureSensor;

  constructor(data: HiLoData) {
    this.data = data;
    this.clock = new AlarmClock();
  }

  update(value: number, time: number): void {
    this.data.currentReading(value, time);
  }

  wakeUp(): void {
    const now = Date.now();
    const initial = 20; // その日の初期温度（仮）
    this.data.newDay(initial, now);
  }

  read(): void {
    this.sensor?.read();
  }

  wakeEveryDay(listener: AlarmListener) {
    this.clock?.wakeEveryDay(listener);
  }

  addObserver() {
    this.sensor?.addObserver(this);
  }
}

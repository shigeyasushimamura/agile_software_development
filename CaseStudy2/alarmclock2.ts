export interface ClockListener {
  tic(): void;
}

export interface AlarmClockImp {
  register(listener: ClockListener): void;
}

export interface StationToolkit {
  getAlarmClock(): AlarmClockImp;
}

export class Nimbus1AlarmClock implements AlarmClockImp {
  private listeners: ClockListener[] = [];
  private timer?: ReturnType<typeof setInterval>;
  constructor() {}
  start(): void {
    this.timer = setInterval(() => {
      this.listeners.forEach((l) => l.tic());
    }, 1000);
  }

  register(listener: ClockListener): void {
    this.listeners.push(listener);
  }

  stop(): void {
    if (this.timer) clearInterval(this.timer);
  }
}
export class Nimbus1Toolkit implements StationToolkit {
  private alarmClock?: AlarmClockImp;

  getAlarmClock(): AlarmClockImp {
    if (!this.alarmClock) {
      this.alarmClock = new Nimbus1AlarmClock();
    }
    return this.alarmClock;
  }
}

export class AlarmClock {
  private imp: AlarmClockImp;
  constructor(st: StationToolkit) {
    this.imp = st.getAlarmClock();
  }
  register(listener: ClockListener) {
    this.imp.register(listener);
  }
}

export class WeatherStationComponent implements ClockListener {
  tic(): void {
    console.log("観測データ取得");
  }
}

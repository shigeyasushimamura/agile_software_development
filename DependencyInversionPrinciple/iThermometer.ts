export abstract class IThermometer {
  constructor(protected t: number = 0) {}

  abstract getTemperature(): number;
}

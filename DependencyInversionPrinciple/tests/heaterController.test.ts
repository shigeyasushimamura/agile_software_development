import { describe, it, vi, expect } from "vitest";
import { HeaterController } from "../heaterController.js";
import { beforeEach } from "node:test";
import exp from "constants";
import { IHeater } from "../iHeater.js";
import { Heater } from "../furnace.js";
import { IThermometer } from "../iThermometer.js";
import { SampleThermometer } from "../sampleThermometer.js";

describe("heater Controller", () => {
  let controller: HeaterController;

  it("can manipulate engageing", () => {
    controller = new HeaterController();
    console.log("co", controller);
    expect(controller.getIsEngage()).toEqual(true);
    controller.switchIsEngage();
    expect(controller.getIsEngage()).toEqual(false);
  });

  it("too hot heater", () => {
    // ヒーター宣言
    let heater: IHeater = new Heater();
    // 温度計宣言
    let thermo: IThermometer = new SampleThermometer(101);

    expect(heater.getIsEngage()).toEqual(true);

    HeaterController.regulate(thermo, heater, 0, 100);
    expect(thermo.getTemperature()).toEqual(101);
    expect(heater.getIsEngage()).toEqual(false);
  });
});

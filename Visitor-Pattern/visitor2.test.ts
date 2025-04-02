import { expect, vi, describe, it, beforeEach } from "vitest";
import {
  ErieModem,
  HayesModem,
  UnixModemConfigurator,
  ZoomModem,
} from "./visitor.js";

describe("visitor,", () => {
  let v = new UnixModemConfigurator();
  let h = new HayesModem();
  let z = new ZoomModem();
  let e = new ErieModem();

  beforeEach(() => {
    v = new UnixModemConfigurator();
    h = new HayesModem();
    z = new ZoomModem();
    e = new ErieModem();
  });

  it("testHayesForUnix", () => {
    h.accept(v);
    expect(h.configurationString).toEqual("&s1=4&D=3");
  });

  it("testZoomForUnix", () => {
    z.accept(v);
    expect(z.configurationValue).toEqual(42);
  });
});

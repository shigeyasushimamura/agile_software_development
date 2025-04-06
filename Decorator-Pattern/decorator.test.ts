import { expect, vi, describe, it } from "vitest";
import { HayesModem, LoudDialModem } from "./decorator.js";

describe("decorator", () => {
  it("testCreateHayes", () => {
    const m = new HayesModem();
    expect(m.getPhoneNumber()).toEqual("");

    m.dial("555");
    expect(m.getPhoneNumber()).toEqual("555");

    m.setSpeakerVolume(111);
    expect(m.getSpeakerVolume()).toEqual(111);
  });

  it("testLoudDialModem", () => {
    const m = new HayesModem();
    const d = new LoudDialModem(m);

    d.setSpeakerVolume(111);
    expect(d.getSpeakerVolume()).toEqual(111); // 一時的にOK

    d.dial("321"); // ← ここで volume = 11 に上書きされる

    expect(d.getPhoneNumber()).toEqual("321");
    expect(d.getSpeakerVolume()).toEqual(11);
  });
});

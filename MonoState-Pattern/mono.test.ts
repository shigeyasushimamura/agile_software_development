import { describe, expect, vi, it, beforeEach } from "vitest";
import { Turnstile } from "./mono.js";

describe("Mono-State", () => {
  beforeEach(() => {
    Turnstile.initializeStates();
  });

  it("test init", () => {
    const t = new Turnstile();

    expect(t.isLocked()).toEqual(true);
    expect(t.isAlarming()).toEqual(false);
  });

  it("test coin", () => {
    const t = new Turnstile();
    t.coin();
    const t2 = new Turnstile();
    // console.log("t", t.isLocked());

    // console.log("t", t.isLocked());

    // console.log("t2", t2.isLocked());
    // console.log("t", t.isLocked());
    expect(t2.isLocked()).toEqual(false);
  });

  it("test coin and pass", () => {
    const t = new Turnstile();
    t.coin();
    expect(t.isLocked()).toEqual(false);
    t.pass();

    expect(t.isLocked()).toEqual(true);
  });

  it("coin and coin", () => {
    const t = new Turnstile();

    t.coin();
    t.coin();

    expect(t.getRefund()).toEqual(1);
  });

  it("violate pass", () => {
    const t = new Turnstile();

    t.pass();

    expect(t.isAlarming()).toEqual(true);
  });
});

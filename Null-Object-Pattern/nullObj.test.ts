import { describe, vi, it, expect } from "vitest";
import { DB, Employee, EmployeeFactory } from "./nullObj.js";

describe("nullObject pattern", () => {
  it("normal", () => {
    const em = DB.getEmployee("");

    expect(em).toBe(EmployeeFactory.NULL);
    expect(em.isTimeToPay(new Date())).toBe(false);
  });
});

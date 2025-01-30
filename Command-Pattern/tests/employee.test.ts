import { expect, describe, it, vi } from "vitest";
import { Employee } from "../employee.js";
import { HourlyClasification, TimeCard } from "../payClassification.js";

describe("employee", () => {
  it("can payCalculate", () => {
    let emp = new Employee("Joon", "Japan");

    const hourlyClassification = new HourlyClasification(2);
    let timeCard = new TimeCard(1, 10);
    hourlyClassification.addTimeCard(timeCard);
    emp.setPayClassification(hourlyClassification);
    const result = emp.calculatePay();

    expect(result).toEqual(20);
  });
});

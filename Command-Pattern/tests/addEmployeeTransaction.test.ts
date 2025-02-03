import { describe, vi, expect, it } from "vitest";
import { AddEmployeeTransaction } from "../addEmployeeTransaction.js";
import { SalariedClassification } from "../payClassification.js";
import { Employee } from "../employee.js";

describe("AddEmployeeTransaction", () => {
  it("can regist", () => {
    const salariedClassification = new SalariedClassification(200000);
    let employees: Employee[] = [];
    const t = new AddEmployeeTransaction(
      "John",
      "Japan",
      salariedClassification,
      employees
    );

    if (t.validate()) {
      t.execute();
    }
    let emp = new Employee("John", "Japan");
    emp.setPayClassification(salariedClassification);
    let employees2 = [emp];

    expect(t.getEmployee()).toEqual(employees2);
  });
});

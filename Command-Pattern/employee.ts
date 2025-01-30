import { PayClassification } from "./payClassification.js";

export class Employee {
  private payClassification: PayClassification | undefined;

  constructor(private name: string, private address: string) {}

  setPayClassification(pay: PayClassification) {
    this.payClassification = pay;
  }

  calculatePay(): number {
    if (!this.payClassification) {
      throw new Error("Pay Calculation should be required");
    }
    return this.payClassification.calculatePay();
  }

  getName() {
    return this.name;
  }
}

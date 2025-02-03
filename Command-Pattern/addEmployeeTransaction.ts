import { ITransaction } from "./ITransaction.js";
import { Employee } from "./employee.js";
import { PayClassification } from "./payClassification.js";

export class AddEmployeeTransaction implements ITransaction {
  private name: string;
  private address: string;
  private payClassification: PayClassification;
  private employees: Employee[];

  constructor(
    name: string,
    address: string,
    payClassification: PayClassification,
    employees: Employee[]
  ) {
    this.name = name;
    this.address = address;
    this.payClassification = payClassification;
    this.employees = employees;
  }

  validate() {
    if (!this.name || !this.address) {
      return false;
    }
    const isDuplicate = this.employees.some(
      (employee) => employee.getName() === this.name
    );

    if (isDuplicate) {
      return false;
    }
    return true;
  }

  execute() {
    const newEmployee = new Employee(this.name, this.address);
    newEmployee.setPayClassification(this.payClassification);

    this.employees.push(newEmployee);
  }

  getEmployee() {
    return this.employees;
  }
}

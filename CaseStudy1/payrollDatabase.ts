import { Employee, Paycheck } from "./employee.js";

export class PayrollDatabase {
  private static itsEmployee = new Map<number, Employee>();
  private static itsUnionMember = new Map<number, Employee>();
  private static itsPaycheck = new Map<number, Paycheck>();

  static getPaycheck(empId: number): Paycheck | undefined {
    const result = this.itsPaycheck.get(empId);
    return result;
  }

  static addPaycheck(empId: number, pc: Paycheck): void {
    this.itsPaycheck.set(empId, pc);
  }

  static getEmployee(empId: number): Employee | undefined {
    const result = this.itsEmployee.get(empId);
    return result;
  }

  static getAllEmployeeIds() {
    return this.itsEmployee.keys();
  }

  static addEmployee(empId: number, emp: Employee) {
    this.itsEmployee.set(empId, emp);
  }

  static clear() {
    this.itsEmployee.clear();
    this.itsUnionMember.clear();
    this.itsPaycheck.clear();
  }

  static deleteEmployee(empId: number) {
    this.itsEmployee.delete(empId);
  }

  static addUnionMember(memberId: number, emp: Employee) {
    this.itsUnionMember.set(memberId, emp);
  }
  static getUnionMember(memberId: number): Employee | undefined {
    const result = this.itsUnionMember.get(memberId);
    return result;
  }

  static deleteUnionMember(memberId: number) {
    this.itsUnionMember.delete(memberId);
  }
}

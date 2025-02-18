import { Employee } from "./employee.js";

export class PayrollDatabase {
  private static itsEmployee = new Map<number, Employee>();
  private static itsUnionMember = new Map<number, Employee>();

  static getEmployee(empId: number): Employee | undefined {
    const result = this.itsEmployee.get(empId);
    return result;
  }

  static addEmployee(empId: number, emp: Employee) {
    this.itsEmployee.set(empId, emp);
  }

  static clear() {
    this.itsEmployee.clear();
    this.itsUnionMember.clear();
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
}

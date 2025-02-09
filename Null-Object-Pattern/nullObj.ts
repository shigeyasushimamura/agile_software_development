export class DB {
  static getEmployee(name: string): Employee {
    return EmployeeFactory.NULL;
  }
}

// export class Employee {
//   static NULL: Employee = new NullEmployee();

//   isTimeToPay(payDay: Date): boolean {
//     return true;
//   }
//   pay(): void {
//     console.log("Paying employee");
//   }
// }

// class NullEmployee extends Employee {
//   isTimeToPay(): boolean {
//     return false;
//   }
//   pay() {
//     console.log("no pay");
//   }
// }

export class Employee {
  isTimeToPay(payDate: Date): boolean {
    return true;
  }
  pay(): void {}
}

export class NullEmployee implements Employee {
  isTimeToPay(payDate: Date): boolean {
    return false;
  }
  pay(): void {
    // 何もしない
  }
}

// Employee の static NULL フィールドを定義
export class EmployeeFactory {
  static NULL: Employee = new NullEmployee();
}

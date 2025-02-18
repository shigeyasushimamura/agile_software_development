import { isModuleNamespaceObject } from "util/types";
import {
  BiweeklySchedule,
  CommissionedClassification,
  Employee,
  HoldMehod,
  HourlyClassification,
  MonthlySchedule,
  PaymentClassification,
  PaymentSchedle,
  SalariedClassification,
  SalesReceipt,
  TimeCard,
  WeeklySchedule,
} from "./employee.js";
import { PayrollDatabase } from "./payrollDatabase.js";

export interface Transaction {
  execute(): void;
}

export abstract class AddEmployeeTransaction implements Transaction {
  private empId: number;
  private itsName: string;
  private itsAddress: string;
  constructor(id: number, name: string, address: string) {
    this.empId = id;
    this.itsName = name;
    this.itsAddress = address;
  }

  execute(): void {
    const pc = this.getClassification();
    const ps = this.getSchedule();
    const pm = new HoldMehod();
    const emp = new Employee(this.empId, this.itsName, this.itsAddress);

    emp.setPaymentClassification(pc);
    emp.setPaymentSchedule(ps);
    emp.setPaymentMethod(pm);

    PayrollDatabase.addEmployee(this.empId, emp);
  }

  abstract getSchedule(): PaymentSchedle;
  abstract getClassification(): PaymentClassification;
}

export class AddSalariedEmployee extends AddEmployeeTransaction {
  private itsSalary;

  constructor(empId: number, name: string, address: string, salary: number) {
    super(empId, name, address);
    this.itsSalary = salary;
  }

  getClassification(): PaymentClassification {
    // console.log("salary:", this.itsSalary);
    return new SalariedClassification(this.itsSalary);
  }

  getSchedule(): PaymentSchedle {
    return new MonthlySchedule();
  }
}

export class AddHourlyEmployee extends AddEmployeeTransaction {
  private timecards: Array<TimeCard>;

  constructor(
    empId: number,
    name: string,
    address: string,
    timecards: Array<TimeCard>
  ) {
    super(empId, name, address);
    this.timecards = timecards;
  }

  getClassification(): PaymentClassification {
    return new HourlyClassification(this.timecards);
  }
  getSchedule(): PaymentSchedle {
    return new WeeklySchedule();
  }
}

export class AddCommissionedEmployee extends AddEmployeeTransaction {
  private salesReceipt: Array<SalesReceipt>;

  constructor(
    empId: number,
    name: string,
    address: string,
    receipt: Array<SalesReceipt>
  ) {
    super(empId, name, address);
    this.salesReceipt = receipt;
  }

  getClassification(): PaymentClassification {
    return new CommissionedClassification(this.salesReceipt);
  }

  getSchedule(): PaymentSchedle {
    return new BiweeklySchedule();
  }
}

export class DeleteEmployeeTransaction implements Transaction {
  private itsEmpId;

  constructor(empId: number) {
    this.itsEmpId = empId;
  }

  execute(): void {
    PayrollDatabase.deleteEmployee(this.itsEmpId);
  }
}

export class TimeCardTransaction implements Transaction {
  private itsDate: Date;
  private itsTime: number;
  private itsEmpId: number;

  constructor(date: Date, time: number, empId: number) {
    this.itsDate = date;
    this.itsTime = time;
    this.itsEmpId = empId;
  }

  execute(): void {
    const e = PayrollDatabase.getEmployee(this.itsEmpId);
    if (e != null) {
      const pc = e.getPaymentClassification();
      if (pc instanceof HourlyClassification) {
        const hc = pc as HourlyClassification;
        pc.addTimecard(new TimeCard(this.itsTime, this.itsDate));
      } else {
        throw new Error(
          "Tried to add timecard are not allowed to non-hourly employee"
        );
      }
    } else {
      throw new Error("No such employee");
    }
  }
}

export class SalesReceiptTransaction {
  private itsDate: Date;
  private itsAmount: number;
  private itsEmpId: number;

  constructor(date: Date, amount: number, empId: number) {
    this.itsDate = date;
    this.itsAmount = amount;
    this.itsEmpId = empId;
  }

  execute(): void {
    const e = PayrollDatabase.getEmployee(this.itsEmpId);

    if (e != null) {
      const pc = e.getPaymentClassification();
      if (pc instanceof CommissionedClassification) {
        const hc = pc as CommissionedClassification;
        pc.addReceipt(new SalesReceipt(this.itsAmount));
      } else {
        throw new Error(
          "Tried to add timecard are not allowed to non-commissioned employee"
        );
      }
    } else {
      throw new Error("No such employee");
    }
  }
}

export abstract class Affiliciation {
  itsBillList = new Map<number, number>();

  constructor() {}

  getServiceCharge(date: number) {
    return this.itsBillList.get(date);
  }

  addServiceCharge(date: number, amount: number) {
    this.itsBillList.set(date, amount);
  }
}

export class UnionAffiliciation extends Affiliciation {
  constructor() {
    super();
  }
}

export class ServiceChargeTransaction implements Transaction {
  itsEmpId: number;
  itsDate: number;
  itsAmount: number;

  constructor(empId: number, date: number, amount: number) {
    this.itsEmpId = empId;
    this.itsDate = date;
    this.itsAmount = amount;
  }

  execute(): void {
    const e = PayrollDatabase.getUnionMember(this.itsEmpId);

    const af = e?.getAffiliciation();

    if (af instanceof UnionAffiliciation) {
      af.addServiceCharge(this.itsDate, this.itsAmount);
    } else {
      throw new Error("should be set UnionAffiliciation");
    }
  }
}

export abstract class ChangeEmployeeTransaction implements Transaction {
  private itsEmpId: number;

  constructor(empId: number) {
    this.itsEmpId = empId;
  }

  execute() {
    const e = PayrollDatabase.getEmployee(this.itsEmpId);
    if (e !== undefined) {
      this.change(e);
    } else {
      throw new Error("selected employee is not found");
    }
  }

  abstract change(e: Employee): void;
}

export class ChangeNameTransaction extends ChangeEmployeeTransaction {
  itsName: string;

  constructor(empId: number, name: string) {
    super(empId);
    this.itsName = name;
  }

  change(e: Employee) {
    e.setName(this.itsName);
    // todo: もしインメモリDBからrdbなど永続DBに変更する場合は、repositoryパターンを利用して、dbへの処理を抽象化する
  }
}

export abstract class ChangeClassificationTransaction extends ChangeEmployeeTransaction {
  constructor(empId: number) {
    super(empId);
  }
  change(e: Employee): void {
    e.setPaymentClassification(this.getClassification());
    e.setPaymentSchedule(this.getSchedule());
  }

  abstract getSchedule(): PaymentSchedle;

  abstract getClassification(): PaymentClassification;
}

export class ChangeHourlyTransaction extends ChangeClassificationTransaction {
  card: TimeCard;
  constructor(empId: number, card: TimeCard) {
    super(empId);
    this.card = card;
  }

  getSchedule(): PaymentSchedle {
    return new WeeklySchedule();
  }

  getClassification(): PaymentClassification {
    return new HourlyClassification([this.card]);
  }
}

export class ChangeSalariedTransaction extends ChangeClassificationTransaction {
  itsSalary: number;

  constructor(empId: number, salary: number) {
    super(empId);
    this.itsSalary = salary;
  }

  getSchedule(): PaymentSchedle {
    return new MonthlySchedule();
  }

  getClassification(): PaymentClassification {
    return new SalariedClassification(this.itsSalary);
  }
}

export class ChangeCommissionedTransaction extends ChangeClassificationTransaction {
  receipt: SalesReceipt;

  constructor(empId: number, receipt: SalesReceipt) {
    super(empId);
    this.receipt = receipt;
  }

  getClassification(): PaymentClassification {
    return new CommissionedClassification([this.receipt]);
  }

  getSchedule(): PaymentSchedle {
    return new BiweeklySchedule();
  }
}

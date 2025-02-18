import { Affiliciation } from "./addEmployeeTransaction.js";

export class Employee {
  id: number;
  name: string;
  address: string;
  paymentClassification: PaymentClassification | null = null;
  paymentMethod: PaymentMethod | null = null;
  paymentSchedule: PaymentSchedle | null = null;
  affiliciation: Affiliciation | null = null;

  constructor(id: number, name: string, address: string) {
    this.id = id;
    this.name = name;
    this.address = address;
  }

  getName() {
    return this.name;
  }

  setName(name: string) {
    this.name = name;
  }

  getAddress() {
    return this.address;
  }

  getAffiliciation() {
    return this.affiliciation;
  }

  setAffiliciation(affiliciation: Affiliciation) {
    this.affiliciation = affiliciation;
  }

  setPaymentClassification(classification: PaymentClassification) {
    this.paymentClassification = classification;
  }
  getPaymentClassification() {
    return this.paymentClassification;
  }

  setPaymentMethod(method: PaymentMethod) {
    this.paymentMethod = method;
  }

  getPaymentMehotd() {
    return this.paymentMethod;
  }

  setPaymentSchedule(schedule: PaymentSchedle) {
    this.paymentSchedule = schedule;
  }

  getPaymentSchedule() {
    return this.paymentSchedule;
  }
}

export interface PaymentClassification {
  calculatePay(): number;
}

export class SalariedClassification implements PaymentClassification {
  itsSalary: number;

  constructor(salary: number) {
    // console.log("salary init");
    // console.log("salary:", salary);
    this.itsSalary = salary;
  }

  calculatePay(): number {
    return this.itsSalary;
  }
}
export class CommissionedClassification implements PaymentClassification {
  basePay = 200000;
  salesReceipt: Array<SalesReceipt> = [];

  constructor(receipt: Array<SalesReceipt>) {
    this.salesReceipt = receipt;
  }

  addReceipt(r: SalesReceipt) {
    this.salesReceipt.push(r);
  }

  getReceipt() {
    return this.salesReceipt;
  }

  calculatePay(): number {
    const total =
      this.basePay +
      this.salesReceipt.reduce((acrr, cur) => acrr + cur.getCommission(), 0);
    return total;
  }
}
export class SalesReceipt {
  commission: number;
  date: Date;
  constructor(c: number, d = new Date()) {
    this.commission = c;
    this.date = d;
  }

  getCommission() {
    return this.commission;
  }
}

export class HourlyClassification implements PaymentClassification {
  basePay = 1000;
  timecards: Array<TimeCard> = [];

  constructor(cards: Array<TimeCard>) {
    this.timecards = cards;
  }

  addTimecard(card: TimeCard) {
    this.timecards.push(card);
  }

  getTimecard(): Array<TimeCard> {
    return this.timecards;
  }

  calculatePay(): number {
    const total = this.timecards.reduce(
      (accu, cur) => accu + cur.getTime() * this.basePay,
      0
    );
    return total;
  }
}
export class TimeCard {
  private time: number;
  private date: Date;

  constructor(time: number, date: Date) {
    this.time = time;
    this.date = date;
  }

  getTime() {
    return this.time;
  }
}

export interface PaymentSchedle {
  calculateSchedule(): number;
}

export class MonthlySchedule implements PaymentSchedle {
  calculateSchedule(): number {
    return 0;
  }
}

export class BiweeklySchedule implements PaymentSchedle {
  calculateSchedule(): number {
    return 0;
  }
}

export class WeeklySchedule implements PaymentSchedle {
  calculateSchedule(): number {
    return 0;
  }
}

export interface PaymentMethod {}

export class HoldMehod implements PaymentMethod {}

export class DirectMethod implements PaymentMethod {}

export class MailMethod implements PaymentMethod {}

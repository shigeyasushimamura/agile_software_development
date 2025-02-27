import { Affiliciation } from "./addEmployeeTransaction.js";

export const isBetween = (theDate: Date, startDate: Date, endDate: Date) => {
  if (startDate <= theDate && theDate <= endDate) {
    return true;
  } else {
    return false;
  }
};

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

  isPayday(date: Date) {
    return this.paymentSchedule?.isPayday(date);
  }

  getPayPeriodStartDate(date: Date): Date | undefined {
    return this.paymentSchedule?.getPayPeriodStartDate(date);
  }

  payday(pc: Paycheck): void {
    const grossPay = this.paymentClassification?.calculatePay(pc) || 0;
    const deduction = this.affiliciation?.calculateDeductions(pc) || 0;
    const netPay = grossPay - deduction;

    if (netPay <= 0) {
      return;
    }

    pc.setGrossPay(grossPay);
    pc.setDeductions(deduction);
    pc.setNetPay(netPay);
    this.paymentMethod?.send();
  }
}

export class Paycheck {
  private itsPeriodStartDate;
  private itsPayday;
  private grossPay = 0;
  private deductions = 0;
  private netPay = 0;

  constructor(startDate: Date, payday: Date) {
    this.itsPeriodStartDate = startDate;
    this.itsPayday = payday;
  }

  getGrossPay() {
    return this.grossPay;
  }
  setGrossPay(p: number) {
    this.grossPay = p;
  }

  getDuductions() {
    return this.deductions;
  }

  setDeductions(p: number) {
    this.deductions = p;
  }

  getNetPay() {
    return this.netPay;
  }

  setNetPay(p: number) {
    this.netPay = p;
  }

  getPeriodStartDate() {
    return this.itsPeriodStartDate;
  }

  getPayday() {
    return this.itsPayday;
  }
}

export interface PaymentClassification {
  calculatePay(pc: Paycheck): number;
}

export class SalariedClassification implements PaymentClassification {
  itsSalary: number;

  constructor(salary: number) {
    // console.log("salary init");
    // console.log("salary:", salary);
    this.itsSalary = salary;
  }

  calculatePay(pc: Paycheck): number {
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

  calculatePay(pc: Paycheck): number {
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
  WORKTIME = 8;
  OVERWORKPAYRATIO = 1.25;

  constructor(cards: Array<TimeCard>) {
    this.timecards = cards;
  }

  addTimecard(card: TimeCard) {
    this.timecards.push(card);
  }

  getTimecard(): Array<TimeCard> {
    return this.timecards;
  }

  calculatePay(pc: Paycheck): number {
    const total = this.timecards.reduce((accu, cur: TimeCard) => {
      let c = 0;

      if (isBetween(cur.getDate(), pc.getPeriodStartDate(), pc.getPayday())) {
        if (!this.isOverwork(cur.getTime())) {
          c = cur.getTime() * this.basePay;
        } else {
          const ot = cur.getTime() - this.WORKTIME;
          c =
            this.WORKTIME * this.basePay +
            ot * this.basePay * this.OVERWORKPAYRATIO;
        }
      }

      return accu + c;
    }, 0);
    return total;
  }

  isOverwork(time: number): boolean {
    if (time < this.WORKTIME) {
      return false;
    } else {
      return true;
    }
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
  getDate() {
    return this.date;
  }
}

export interface PaymentSchedle {
  isPayday(date: Date): boolean;
  getPayPeriodStartDate(date: Date): Date;
}

export class MonthlySchedule implements PaymentSchedle {
  isPayday(date: Date): boolean {
    return this.isLastDayOfMonth(date);
  }

  isLastDayOfMonth(date: Date): boolean {
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);

    return nextDay.getMonth() !== date.getMonth();
  }

  getPayPeriodStartDate(date: Date) {
    const startDate = new Date(date);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);
    return startDate;
  }
}

export class BiweeklySchedule implements PaymentSchedle {
  isPayday(date: Date): boolean {
    return this.isBiweek(date);
  }
  isBiweek(date: Date): boolean {
    const day = date.getDate();
    return day === 14 || day === 28;
  }
  getPayPeriodStartDate(date: Date) {
    const startDate = new Date(date);
    if (date.getDate() <= 14) {
      startDate.setDate(1);
    } else {
      startDate.setDate(14);
    }
    startDate.setHours(0, 0, 0, 0);
    return startDate;
  }
}

export class WeeklySchedule implements PaymentSchedle {
  isPayday(date: Date): boolean {
    return this.isFriday(date);
  }

  isFriday(date: Date): boolean {
    const friday = 5;
    return date.getDay() === friday;
  }
  getPayPeriodStartDate(date: Date) {
    const startDate = new Date(date);
    const dayOfWeek = startDate.getDay();
    const diffToMonday = (dayOfWeek + 6) % 7;
    startDate.setDate(startDate.getDate() - diffToMonday);
    // console.log("date", date);
    // console.log("startDate:", startDate);
    return startDate;
  }
}

export interface PaymentMethod {
  send(): boolean;
}

export class HoldMehod implements PaymentMethod {
  private address: string;
  constructor(address: string) {
    this.address = address;
  }
  send(): boolean {
    return true;
  }
}

export class DirectMethod implements PaymentMethod {
  private bankId: number;
  private accountId: number;

  constructor(bankId: number, accountId: number) {
    this.bankId = bankId;
    this.accountId = accountId;
  }

  send(): boolean {
    return true;
  }
}

export class MailMethod implements PaymentMethod {
  private address: string;
  constructor(address: string) {
    this.address = address;
  }
  send(): boolean {
    return true;
  }
}

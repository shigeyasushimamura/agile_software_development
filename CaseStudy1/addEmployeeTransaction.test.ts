import { describe, vi, it, expect, beforeEach } from "vitest";
import {
  AddCommissionedEmployee,
  AddEmployeeTransaction,
  AddHourlyEmployee,
  AddSalariedEmployee,
  ChangeClassificationTransaction,
  ChangeCommissionedTransaction,
  ChangeDirectTransaction,
  ChangeHoldTransaction,
  ChangeHourlyTransaction,
  ChangeMailTransaction,
  ChangeMemberTransaction,
  ChangeMethodTransaction,
  ChangeNameTransaction,
  ChangeSalariedTransaction,
  ChangeUnaffiliciatedTransaction,
  NoAffiliciation,
  PaydayTransaction,
  SalesReceiptTransaction,
  ServiceChargeTransaction,
  TimeCardTransaction,
  UnionAffiliciation,
} from "./addEmployeeTransaction.js";
import { PayrollDatabase } from "./payrollDatabase.js";
import {
  CommissionedClassification,
  DirectMethod,
  Employee,
  HoldMehod,
  HourlyClassification,
  MonthlySchedule,
  SalariedClassification,
  SalesReceipt,
  TimeCard,
} from "./employee.js";

describe("test add employee transaction", () => {
  beforeEach(() => {
    PayrollDatabase.clear();
  });

  it("add salaried employee", () => {
    const empId = 1;
    let tx = new AddSalariedEmployee(empId, "Bob", "tokyo", 1000);
    // console.log("tx:", tx);
    tx.execute();
    const emp = PayrollDatabase.getEmployee(empId);
    // console.log("emp", emp);
    expect(emp?.getName()).toEqual("Bob");
    let pc = emp?.getPaymentClassification();

    let salariedClassification = pc as SalariedClassification;
    expect(salariedClassification.calculatePay()).toEqual(1000);
    let ps = emp?.getPaymentSchedule() as MonthlySchedule;
    expect(ps).not.toBeNull();
    let hm = emp?.getPaymentMehotd() as HoldMehod;
    expect(hm).not.toBeNull();

    // delete処理
    PayrollDatabase.deleteEmployee(empId);
    const emp2 = PayrollDatabase.getEmployee(empId);
    expect(emp2).toBeUndefined();
  });

  it("add commissioned employee", () => {
    const empId = 3;
    // SalesReceiptを作成
    const r = new SalesReceipt(1000000);

    // Commissioned Employee TX を追加
    // param: empId, name, address, [Sales Receipt]
    const tx = new AddCommissionedEmployee(empId, "Bob", "Tokyo", [r]);
    tx.execute();

    // Commissioned EmployeeをDBから取得
    const emp = PayrollDatabase.getEmployee(empId);

    // calculate Payして想定する値かを見る
    expect(emp?.getPaymentClassification()?.calculatePay()).toEqual(1200000);

    // delete処理
    PayrollDatabase.deleteEmployee(empId);
    const emp2 = PayrollDatabase.getEmployee(empId);
    expect(emp2).toBeUndefined();
  });

  it("testTimecardTransaction normal", () => {
    let empId = 4;
    const tx = new AddHourlyEmployee(empId, "Bob", "Tokyo", []);
    tx.execute();
    const tct = new TimeCardTransaction(new Date(), 10, empId);
    tct.execute();

    const emp = PayrollDatabase.getEmployee(empId);
    const hc = emp?.getPaymentClassification();
    let tc: Array<TimeCard> = [];

    if (hc instanceof HourlyClassification) {
      tc = hc.getTimecard();
    }

    expect(tc).not.null;
    expect(tc[0].getTime()).toEqual(10);
  });

  it("testSalesReceiptTX normal", () => {
    let empId = 5;
    const tx = new AddCommissionedEmployee(empId, "Bob", "Tokyo", []);
    tx.execute();
    const stx = new SalesReceiptTransaction(new Date(), 777, empId);
    stx.execute();

    const emp = PayrollDatabase.getEmployee(empId);
    const cc = emp?.getPaymentClassification();
    let sr: Array<SalesReceipt> = [];
    if (cc instanceof CommissionedClassification) {
      sr = cc.getReceipt();
    }
    expect(sr).not.null;
    expect(sr[0].getCommission()).toEqual(777);
  });

  it("add affiliciation", () => {
    const empId = 6;
    const emp = new AddHourlyEmployee(empId, "Bob", "Tokyo", []);
    emp.execute();

    const ttx = new TimeCardTransaction(new Date(), 10, empId);
    ttx.execute();

    const e = PayrollDatabase.getEmployee(empId);
    const memberId = 111;
    const af = new UnionAffiliciation(memberId);
    e?.setAffiliciation(af);

    if (e instanceof Employee) {
      PayrollDatabase.addUnionMember(memberId, e);
    }
    const td = new Date(2025, 2, 18);
    const sct = new ServiceChargeTransaction(memberId, td, 100);
    sct.execute();

    const sc = af.getServiceCharge(td);

    expect(sc).toEqual(100);
  });

  it("testChangeNameTransaction", () => {
    const empId = 7;
    const emp = new AddHourlyEmployee(empId, "Bob", "Tokyo", []);
    emp.execute();

    // change name用のtransaction(ctx)の宣言
    const ctx = new ChangeNameTransaction(empId, "Ann");
    // ctxの実行
    ctx.execute();

    const e = PayrollDatabase.getEmployee(empId);

    expect(e).not.null;
    expect(e?.getName()).toEqual("Ann");
  });

  it("testChangeSalariedTransaction", () => {
    const empId = 8;
    const tx = new AddCommissionedEmployee(empId, "Lance", "Home", []);
    tx.execute();
    const cht = new ChangeSalariedTransaction(empId, 555555);
    cht.execute();

    const emp = PayrollDatabase.getEmployee(empId);
    const pc = emp?.getPaymentClassification();
    const ps = emp?.getPaymentSchedule();

    expect(pc?.calculatePay()).toEqual(555555);
    expect(ps?.isPayday(new Date())).toEqual(expect.any(Boolean));
  });

  it("testChangeSalariedTransaction", () => {
    const empId = 8;
    const tx = new AddSalariedEmployee(empId, "Lance", "Home", 10000);
    tx.execute();
    // const cht = new ChangeHourlyTransaction(empId,[new TImecard(10,new Date())])
    const cht = new ChangeCommissionedTransaction(
      empId,
      new SalesReceipt(100, new Date())
    );
    cht.execute();

    const emp = PayrollDatabase.getEmployee(empId);
    const pc = emp?.getPaymentClassification();
    const ps = emp?.getPaymentSchedule();
    // console.log("pc", pc);
    // console.log("ps", ps);
    expect(pc?.calculatePay()).toEqual(200100);
    expect(ps?.isPayday(new Date())).toEqual(expect.any(Boolean));
  });

  it("testChangeSalariedTransaction", () => {
    const empId = 8;
    const tx = new AddSalariedEmployee(empId, "Lance", "Home", 10000);
    tx.execute();

    const cdt = new ChangeDirectTransaction(empId, 1, 111111);
    cdt.execute();

    const emp = PayrollDatabase.getEmployee(empId);
    const pm = emp?.getPaymentMehotd();

    expect(pm?.send()).toEqual(true);
  });

  it("testChangeMailTransaction", () => {
    const empId = 8;
    const tx = new AddSalariedEmployee(empId, "Lance", "Home", 10000);
    tx.execute();

    const cdt = new ChangeMailTransaction(empId, "kyoto");
    cdt.execute();

    const emp = PayrollDatabase.getEmployee(empId);
    const pm = emp?.getPaymentMehotd();

    expect(pm?.send()).toEqual(true);
  });

  it("testChangeHoldTransaction", () => {
    const empId = 8;
    const tx = new AddSalariedEmployee(empId, "Lance", "Home", 10000);
    tx.execute();

    const cdt = new ChangeHoldTransaction(empId, "kyoto");
    cdt.execute();

    const emp = PayrollDatabase.getEmployee(empId);
    const pm = emp?.getPaymentMehotd();

    expect(pm?.send()).toEqual(true);
  });

  it("testChangeMemberTransaction", () => {
    const empId = 9;
    const tx = new AddSalariedEmployee(empId, "Lance", "Home", 10000);
    tx.execute();

    const memberId = 101;
    const cmt = new ChangeMemberTransaction(empId, memberId);
    cmt.execute();

    const emp = PayrollDatabase.getEmployee(empId);
    const af = emp?.getAffiliciation();

    // expect(af).toBeInstanceOf(UnionAffiliciation)
    let mem = undefined;
    if (af instanceof UnionAffiliciation) {
      mem = af.getMemberId();
    }

    expect(mem).toEqual(memberId);
  });

  it("testChangeUnaffiliciationTransaction", () => {
    const empId = 9;
    const tx = new AddSalariedEmployee(empId, "Lance", "Home", 10000);
    tx.execute();

    const memberId = 101;
    const cmt = new ChangeUnaffiliciatedTransaction(empId);
    cmt.execute();

    const emp = PayrollDatabase.getEmployee(empId);
    const af = emp?.getAffiliciation();

    expect(af).toBeInstanceOf(NoAffiliciation);
  });

  it("testPaySingleSalariedEmployee", () => {
    const empId = 10;
    const tx = new AddSalariedEmployee(empId, "Lanve", "home", 10000);
    tx.execute();

    const today = new Date(2025, 1, 28);
    const pt = new PaydayTransaction(today);
    pt.execute();

    const pc = PayrollDatabase.getPaycheck(empId);
    // console.log("pc:", pc);
    expect(pc?.getGrossPay()).toEqual(10000);
  });

  it("testPaySingleSalariedEmployee not payday", () => {
    const empId = 10;
    const tx = new AddSalariedEmployee(empId, "Lanve", "home", 10000);
    tx.execute();

    const today = new Date(2025, 1, 27);
    const pt = new PaydayTransaction(today);
    pt.execute();

    const pc = PayrollDatabase.getPaycheck(empId);

    expect(pc).toBeNull;
  });

  it("testPaySingleHourlyEmployeeNoTimeCards", () => {
    const empId = 11;
    const tx = new AddHourlyEmployee(empId, "Bob", "Tokyo", []);
    tx.execute();
    const today = new Date(2025, 1, 28);
    const pt = new PaydayTransaction(today);
    pt.execute();
    validateHourlyPaycheck(empId, today, 0);
  });

  it("testPaysinglehourlyemployeeoneTImeCard", () => {
    const empId = 12;
    const tx = new AddHourlyEmployee(empId, "Bob", "Tokyo", []);
    tx.execute();
    const yesterday = new Date(2025, 1, 27);
    const today = new Date(2025, 1, 28);
    const tc = new TimeCardTransaction(yesterday, 8, empId);
    tc.execute();

    const pt = new PaydayTransaction(today);
    pt.execute();
    validateHourlyPaycheck(empId, today, 8000);
  });

  it("testPaysinglehourlyemployeeOvertimeoneTImeCard2", () => {
    const empId = 13;
    // console.log("empId", empId);
    const tx = new AddHourlyEmployee(empId, "Bob", "Tokyo", []);
    tx.execute();
    const yesterday = new Date(2025, 1, 27);
    const today = new Date(2025, 1, 28);
    const tc = new TimeCardTransaction(yesterday, 10, empId);
    tc.execute();

    const pt = new PaydayTransaction(today);
    pt.execute();
    validateHourlyPaycheck(empId, today, 10500);
  });

  it("testPaySingleHourlyEmployeeOnWrongDay", () => {
    const empId = 14;
    const tx = new AddHourlyEmployee(empId, "Bob", "Tokyo", []);
    tx.execute();
    const today = new Date(2025, 2, 26);
    const tc = new TimeCardTransaction(today, 8, empId);
    tc.execute();
    const pt = new PaydayTransaction(today);
    pt.execute();

    const pc = PayrollDatabase.getPaycheck(empId);
    expect(pc).toBeUndefined();
  });

  it("testPaySingleHourlyEmployeeTwoTimeCard", () => {
    const empId = 15;
    const tx = new AddHourlyEmployee(empId, "Bob", "Tokyo", []);
    tx.execute();
    const yesterday = new Date(2025, 1, 27);
    const today = new Date(2025, 1, 28);
    const tc = new TimeCardTransaction(yesterday, 10, empId);
    const tc2 = new TimeCardTransaction(yesterday, 10, empId);
    tc.execute();
    tc2.execute();

    const pt = new PaydayTransaction(today);
    pt.execute();
    validateHourlyPaycheck(empId, today, 10500 * 2);
  });

  it("testPaySingleHourlyEmployeeWithTimeCardsSpanningTwoPayPeriods", () => {
    const empId = 15;
    const tx = new AddHourlyEmployee(empId, "Bob", "Tokyo", []);
    tx.execute();
    const yesterday = new Date(2025, 1, 27);
    const today = new Date(2025, 1, 28);
    const lastYear = new Date(2024, 1, 27);
    const tc = new TimeCardTransaction(yesterday, 10, empId);
    const tc2 = new TimeCardTransaction(lastYear, 10, empId);
    tc.execute();
    tc2.execute();

    const pt = new PaydayTransaction(today);
    pt.execute();
    validateHourlyPaycheck(empId, today, 10500);
  });

  it("testSalariedUnionMemberDues", () => {
    const empId = 16;
    const tx = new AddSalariedEmployee(empId, "Bob", "Tokyo", 100000);
    tx.execute();

    const memId = 16;
    const cmt = new ChangeMemberTransaction(empId, memId, 100);
    cmt.execute();

    const today = new Date(2025, 1, 28);
    const fridayNum = 4;

    const pt = new PaydayTransaction(today);
    pt.execute();
    const pc = PayrollDatabase.getPaycheck(empId);

    // console.log("pc", pc);
    expect(pc?.getGrossPay()).toEqual(100000);
    expect(pc?.getDuductions()).toEqual(fridayNum * 100);
    expect(pc?.getNetPay()).toEqual(100000 - 100 * fridayNum);
  });

  const validateHourlyPaycheck = (empId: number, date: Date, pay: number) => {
    const pc = PayrollDatabase.getPaycheck(empId);
    // console.log("pc", pc);
    expect(pc).not.toBeNull;
    expect(pc?.getGrossPay()).toEqual(pay);
    expect(pc?.getNetPay()).toEqual(pay);
    expect(pc?.getDuductions()).toEqual(0);
  };
});

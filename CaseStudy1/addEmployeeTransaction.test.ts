import { describe, vi, it, expect } from "vitest";
import {
  AddCommissionedEmployee,
  AddEmployeeTransaction,
  AddHourlyEmployee,
  AddSalariedEmployee,
  ChangeClassificationTransaction,
  ChangeCommissionedTransaction,
  ChangeHourlyTransaction,
  ChangeNameTransaction,
  ChangeSalariedTransaction,
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

  it("add hourly employee", () => {
    const empId = 2;
    const card1 = new TimeCard(10, new Date());
    let tx = new AddHourlyEmployee(empId, "Bob", "tolyo", [card1]);
    tx.execute();

    const emp = PayrollDatabase.getEmployee(empId);
    console.log("emp:", emp);
    expect(emp?.getPaymentClassification()?.calculatePay()).toEqual(10000);

    const pc = emp?.getPaymentClassification() as HourlyClassification;
    const card2 = new TimeCard(1, new Date());
    pc.addTimecard(card2);

    emp?.setPaymentClassification(pc);

    expect(emp?.getPaymentClassification()?.calculatePay()).toEqual(11000);

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
    const af = new UnionAffiliciation();
    e?.setAffiliciation(af);
    const memberId = 111;
    if (e instanceof Employee) {
      PayrollDatabase.addUnionMember(memberId, e);
    }

    const sct = new ServiceChargeTransaction(memberId, 20250218, 100);
    sct.execute();

    const sc = af.getServiceCharge(20250218);
    // console.log("sc:", sc);
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

  it("testChangeHourlyTransaction", () => {
    const empId = 8;
    const tx = new AddCommissionedEmployee(empId, "Lance", "Home", []);
    tx.execute();
    // const cht = new ChangeHourlyTransaction(empId,[new TImecard(10,new Date())])
    const cht = new ChangeHourlyTransaction(
      empId,
      new TimeCard(10, new Date())
    );
    cht.execute();

    const emp = PayrollDatabase.getEmployee(empId);
    const pc = emp?.getPaymentClassification();
    const ps = emp?.getPaymentSchedule();
    // console.log("pc", pc);
    // console.log("ps", ps);
    expect(pc?.calculatePay()).toEqual(1000 * 10);
    expect(ps?.calculateSchedule()).toEqual(100);
  });

  it("testChangeSalariedTransaction", () => {
    const empId = 8;
    const tx = new AddCommissionedEmployee(empId, "Lance", "Home", []);
    tx.execute();
    // const cht = new ChangeHourlyTransaction(empId,[new TImecard(10,new Date())])
    const cht = new ChangeSalariedTransaction(empId, 555555);
    cht.execute();

    const emp = PayrollDatabase.getEmployee(empId);
    const pc = emp?.getPaymentClassification();
    const ps = emp?.getPaymentSchedule();
    // console.log("pc", pc);
    // console.log("ps", ps);
    expect(pc?.calculatePay()).toEqual(555555);
    expect(ps?.calculateSchedule()).toEqual(160);
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
    expect(ps?.calculateSchedule()).toEqual(14);
  });
});

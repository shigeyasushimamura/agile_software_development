export interface PayClassification {
  calculatePay(): number;
}

export class HourlyClasification implements PayClassification {
  private timeCards: TimeCard[] = [];
  private hourlyRateValue: number;

  constructor(hourlyRate: number) {
    this.hourlyRateValue = hourlyRate;
  }

  addTimeCard(timeCard: TimeCard): void {
    this.timeCards.push(timeCard);
  }

  calculatePay(): number {
    return this.timeCards.reduce(
      (total, timeCard) => total + timeCard.hours * this.hourlyRateValue,
      0
    );
  }

  getHourlyRate(): number {
    return this.hourlyRateValue;
  }

  setHourlyRate(hourlyRate: number): void {
    this.hourlyRateValue = hourlyRate;
  }
}

export class TimeCard {
  constructor(public date: number, public hours: number) {}
}

// SalariedClassification.ts
export class SalariedClassification implements PayClassification {
  private monthlyPayValue: number;

  constructor(monthlyPay: number) {
    this.monthlyPayValue = monthlyPay;
  }

  // 月給計算
  calculatePay(): number {
    return this.monthlyPayValue;
  }
}

// CommissionedClassification.ts
export class CommissionedClassification implements PayClassification {
  private basePay: number;
  private commissionRate: number;
  private salesReceipts: SalesReceipt[] = [];

  constructor(basePay: number, commissionRate: number) {
    this.basePay = basePay;
    this.commissionRate = commissionRate;
  }

  // 売上レシートを追加
  addSalesReceipt(salesReceipt: SalesReceipt): void {
    this.salesReceipts.push(salesReceipt);
  }

  // 歩合計算
  calculatePay(): number {
    const commission = this.salesReceipts.reduce(
      (total, receipt) => total + receipt.amount * this.commissionRate,
      0
    );
    return this.basePay + commission;
  }
}

export class SalesReceipt {
  constructor(public date: number, public amount: number) {}
}

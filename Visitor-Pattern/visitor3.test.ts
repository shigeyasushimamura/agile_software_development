// CsvSalesReportVisitor.test.ts
import { describe, it, expect } from "vitest";
import { CsvSalesReportVisitor, Client, Salesperson } from "./visitor3.js";

describe("CsvSalesReportVisitor", () => {
  it("正しいCSV形式で出力される", () => {
    // Arrange
    const clients = [
      new Client("顧客A", 100000, 2, 1),
      new Client("顧客B", 200000, 3, 2),
    ];
    const salesperson = new Salesperson("田中", clients);

    const visitor = new CsvSalesReportVisitor();

    // Act
    salesperson.accept(visitor);
    const result = visitor.getCsv();

    // Assert
    expect(result).toContain("営業担当,顧客名,売上,訪問回数,提案件数");
    expect(result).toContain("田中,顧客A,100000,2,1");
    expect(result).toContain("田中,顧客B,200000,3,2");

    // 行数チェック（ヘッダー含めて3行）
    expect(result.split("\n")).toHaveLength(3);
  });

  it("複数のSalespersonをまとめて出力できる", () => {
    const sp1 = new Salesperson("佐藤", [new Client("A社", 100000, 1, 1)]);
    const sp2 = new Salesperson("鈴木", [new Client("B社", 500000, 4, 3)]);
    const visitor = new CsvSalesReportVisitor();

    sp1.accept(visitor);
    sp2.accept(visitor);
    const csv = visitor.getCsv();

    expect(csv.split("\n")).toHaveLength(3); // ヘッダー + 2行
    expect(csv).toMatch(/佐藤,A社,100000,1,1/);
    expect(csv).toMatch(/鈴木,B社,500000,4,3/);
  });
});

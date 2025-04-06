export interface Part {
  getPartNumber(): string;
  getDescription(): String;
  accept(v: PartVisitor): void;
}

export interface PartVisitor {
  visit(p: PiecePart): void;
  visit(p: Assembly): void;
}

export class Assembly implements Part {
  private itsParts: Array<Part> = new Array();
  private itsPartNumber = "";
  private itsDescription = "";

  constructor(partNumber: string, description: string) {
    this.itsPartNumber = partNumber;
    this.itsDescription = description;
  }

  accept(v: PartVisitor) {
    v.visit(this);
  }

  add(part: Part) {
    this.itsParts.push(part);
  }
  getParts() {
    return this.itsParts;
  }
  getPartNumber(): string {
    return this.itsPartNumber;
  }

  getDescription(): String {
    return this.itsDescription;
  }
}

export class PiecePart implements Part {
  private itsCost = 0;
  private itsPartNumber = "";
  private itsDescription = "";

  constructor(partNumber: string, description: string, cost: number) {
    this.itsPartNumber = partNumber;
    this.itsDescription = description;
    this.itsCost = cost;
  }

  accept(v: PartVisitor) {
    v.visit(this);
  }

  getCost() {
    return this.itsCost;
  }
  getPartNumber(): string {
    return this.itsPartNumber;
  }

  getDescription(): String {
    return this.itsDescription;
  }
}

export class ExplodedCostVisitor implements PartVisitor {
  private cost = 0;
  getCost() {
    return this.cost;
  }
  visit(p: PiecePart): void;
  visit(p: Assembly): void;
  visit(p: Part): void {
    if (p instanceof PiecePart) {
      this.cost += p.getCost();
    } else if (p instanceof Assembly) {
    }
  }
}

export class PartCountVisitor implements PartVisitor {
  private itsPieceCount = 0;
  private itsPieceMap = new Map();

  visit(p: PiecePart): void;
  visit(p: Assembly): void;
  visit(p: Part): void {
    if (p instanceof PiecePart) {
      this.itsPieceCount++;
      const partNumber = p.getPartNumber();
      let partNumberCount = 0;
      if (this.itsPieceMap.has(partNumberCount)) {
      }
    } else if (p instanceof Assembly) {
    }
  }
}
interface Reportable {
  accept(visitor: ReportVisitor): void;
}

interface ReportVisitor {
  visitSalesperson(sp: Salesperson): void;
  visitClient(client: Client): void;
}

export class Salesperson implements Reportable {
  constructor(public name: string, public clients: Client[]) {}
  accept(v: ReportVisitor) {
    v.visitSalesperson(this);
  }
}

export class Client implements Reportable {
  constructor(
    public name: string,
    public sales: number,
    public visits: number,
    public proposals: number
  ) {}
  accept(v: ReportVisitor) {
    v.visitClient(this);
  }
}

interface ReportVisitor {
  visitSalesperson(sp: Salesperson): void;
  visitClient(client: Client): void;
}

export class CsvSalesReportVisitor implements ReportVisitor {
  rows: string[] = ["営業担当,顧客名,売上,訪問回数,提案件数"];
  private currentSalesperson = "";

  visitSalesperson(sp: Salesperson) {
    this.currentSalesperson = sp.name;
    sp.clients.forEach((client) => client.accept(this));
  }

  visitClient(client: Client) {
    this.rows.push(
      `${this.currentSalesperson},${client.name},${client.sales},${client.visits},${client.proposals}`
    );
  }

  getCsv(): string {
    return this.rows.join("\n");
  }
}

export interface Database {
  query(sql: string): void;
}

export class DatabaseImplementation implements Database {
  query(sql: string): void {
    console.log(`Executing SQL:${sql}`);
  }
}

export interface DatabaseFactory {
  createDatabase(): Database;
}

export class DatabaseFactoryImplementation implements DatabaseFactory {
  createDatabase(): Database {
    return new DatabaseImplementation();
  }
}

// Payroll 本番環境で利用
export class Payroll {
  private database: Database;
  constructor(factory: DatabaseFactory) {
    this.database = factory.createDatabase();
  }
  runPayroll(): void {
    this.database.query("SELECT * FROM employee");
  }
}

// テスト用
export class TestPayroll {
  private database: Database;
  constructor(factory: DatabaseFactory) {
    this.database = factory.createDatabase();
  }
  runTest(): void {
    this.database.query("SELECT * FROM employee");
  }
}

export interface ShapeFactory {
  make(shapeName: string): Shape;
}

export class ShapeFactoryImplementation implements ShapeFactory {
  make(shapeName: string): Shape {
    if (shapeName === "Circle") {
      return new Circle();
    } else if (shapeName === "Square") {
      return new Square();
    }
    return new Square();
  }
}

export interface Shape {
  draw(): void;
}

export class Square implements Shape {
  draw(): void {
    console.log("square");
  }
}

export class Circle implements Shape {
  draw(): void {
    console.log("circle");
  }
}

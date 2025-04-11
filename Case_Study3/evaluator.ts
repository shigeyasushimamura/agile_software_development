export interface Evaluator {
  evaluate(score: number): string;
}

export type Pair = {
  name: string;
  score: number;
};

export class Matrix {
  private data: Pair[][] = [];

  // 行を追加
  addRow(row: Pair[]): void {
    this.data.push(row);
  }

  // 任意位置に追加（例：セル単位）
  set(i: number, j: number, pair: Pair): void {
    if (!this.data[i]) this.data[i] = [];
    this.data[i][j] = pair;
  }

  get(i: number, j: number): Pair | undefined {
    return this.data[i]?.[j];
  }

  getRows(): Pair[][] {
    return this.data;
  }

  getRowCount(): number {
    return this.data.length;
  }

  getColCount(): number {
    return this.data[0]?.length ?? 0;
  }
}

export class ScoreEvaluator implements Evaluator {
  evaluate(score: number): string {
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F";
  }
}

export class FeatureGroup {
  protected evaluators: Evaluator[] = [];
  private matrix: Matrix = new Matrix();

  constructor(public name: string) {}

  addEvaluator(e: Evaluator): void {
    this.evaluators.push(e);
  }

  addMatrixRow(row: Pair[]): void {
    this.matrix.addRow(row);
  }

  evaluateAll(): string[][] {
    const results: string[][] = [];
    const rows = this.matrix.getRows();

    for (const row of rows) {
      const rowResults: string[] = [];
      for (const pair of row) {
        for (const evaluator of this.evaluators) {
          rowResults.push(`${pair.name}: ${evaluator.evaluate(pair.score)}`);
        }
      }
      results.push(rowResults);
    }

    return results;
  }
}

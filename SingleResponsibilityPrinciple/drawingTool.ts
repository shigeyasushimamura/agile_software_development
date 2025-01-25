export class DrawingTool {
  static drawAllShapes(shapeList: AShape[]): void {
    const orderedList = this.drawingOrderSort(shapeList);
    for (const shape of orderedList) {
      shape.draw();
    }
  }

  static drawingOrderSort(shapeList: AShape[]): AShape[] {
    let orderedList = shapeList.sort((a, b) => ShapeComparator.compare(a, b));

    return orderedList;
  }
}

class ShapeComparator {
  static compare(s1: AShape, s2: AShape) {
    if (s1.preceed(s2)) {
      return -1;
    } else {
      return 1;
    }
  }
}

export abstract class AShape {
  constructor() {}
  typeOrderTables = ["circle", "square", "triangle"];

  abstract getTypes(): string;

  abstract draw(): void;
  preceed(shape: AShape): boolean {
    let thisType = this.getTypes();
    let argType = shape.getTypes();
    let thisOrd = -1;
    let argOrd = -1;
    let ord = 0;

    for (const tableEntity of this.typeOrderTables) {
      if (tableEntity === thisType) {
        thisOrd = ord;
      }
      if (tableEntity === argType) {
        argOrd = ord;
      }
      if (0 <= argOrd && 0 <= thisOrd) {
        break;
      }
      ord++;
    }
    return thisOrd < argOrd;
  }
}

export class Square extends AShape {
  constructor(private itsSide: number) {
    super();
  }
  getTypes(): string {
    return "square";
  }
  draw(): void {}
}

export class Circle extends AShape {
  constructor(private itsRadious: number, private itsCenter: number) {
    super();
  }

  getTypes(): string {
    return "circle";
  }

  draw(): void {}
}

export class Triangle extends AShape {
  constructor(private edge: number) {
    super();
  }
  getTypes(): string {
    return "triangle";
  }
  draw(): void {}
}

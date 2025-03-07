export interface Shape {
  draw(): void;
}

export class Triangle implements Shape {
  draw(): void {
    console.log("triangle");
  }
}

export class Circle implements Shape {
  draw(): void {
    console.log("circle");
  }
}

export class CompositeShape implements Shape {
  private itsShapeList: Array<Shape> = [];
  add(s: Shape) {
    this.itsShapeList.push(s);
  }
  draw(): void {
    for (const s of this.itsShapeList) {
      s.draw();
    }
  }
}

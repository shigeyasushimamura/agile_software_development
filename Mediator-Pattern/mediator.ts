export class Enemy {
  constructor(private name: string, private mediator: EnemyMediator) {}

  spotPlayer() {
    console.log(`${this.name}: プレイヤーを発見！`);
    this.mediator.notify(this, "player_spotted");
  }
  attack() {
    console.log(`${this.name}:攻撃する`);
  }
}

export class EnemyMediator {
  private enemies: Enemy[];

  constructor(enemies: Enemy[] = []) {
    this.enemies = enemies;
  }
  addEnemy(enemy: Enemy) {
    this.enemies.push(enemy);
  }

  notify(sender: Enemy, event: string) {
    if (event == "player_spotted") {
      console.log("Mediator: プレイヤーを発見した！各自迎撃指令を出す！");
    }
  }
}

// DI原則に沿うため、mediator と NPCの間にIFをおく
interface INPC {
  getName(): string;
  getPosition(): { x: number; y: number };
  enterArea(): void;
  leaveArea(): void;
  updateState(newState: string): void;
  move(newX: number, newY: number): void;
  avoidCollision(): void;
}

export class NPC implements INPC {
  private state: string;
  private position: { x: number; y: number };

  constructor(private name: string, private mediator: NPCMediator) {
    this.state = "walking"; // 初期状態
    this.position = { x: Math.random() * 100, y: Math.random() * 100 }; // ランダムな位置
  }

  getName(): string {
    return this.name;
  }

  getPosition(): { x: number; y: number } {
    return this.position;
  }

  enterArea() {
    console.log(`${this.name}: エリアに入る`);
    this.mediator.notify(this, "entered");
  }

  leaveArea() {
    console.log(`${this.name}: エリアを出る`);
    this.mediator.notify(this, "left");
  }

  updateState(newState: string) {
    console.log(`${this.name}: 状態が ${newState} に変更されました`);
    this.state = newState;
  }

  move(newX: number, newY: number) {
    console.log(`${this.name}: 新しい位置に移動 ${newX}, ${newY}`);
    this.position = { x: newX, y: newY };
  }

  avoidCollision() {
    console.log(`${this.name}: 他のNPCと衝突しないように移動`);
    this.position.x += Math.random() * 5;
    this.position.y += Math.random() * 5;
  }
}

export class NPCMediator {
  private npcs: INPC[] = [];
  private maxCapacity: number;

  constructor(maxCapacity: number) {
    this.maxCapacity = maxCapacity;
  }

  addNPC(npc: INPC) {
    if (this.npcs.length >= this.maxCapacity) {
      console.log(`Mediator: エリアが満員で${npc}は入れません`);
      return;
    }
    this.npcs.push(npc);
  }

  notify(sender: INPC, event: string) {
    if (event === "entered") {
      console.log(`Mediator: ${sender} がエリアに入りました`);
      this.checkCrowdDensity();
      this.handleProximity(sender);
    } else if (event === "left") {
      console.log(`Mediator: ${sender} がエリアを出ました`);
      this.npcs = this.npcs.filter((npc) => npc !== sender);
      this.checkCrowdDensity();
    }
  }

  handleProximity(sender: INPC) {
    const threshold = 10; // 近距離の閾値
    this.npcs.forEach((npc) => {
      if (npc !== sender && this.getDistance(npc, sender) < threshold) {
        console.log(`${npc} は ${sender} に近すぎるので離れろ！`);
        npc.avoidCollision();
      }
    });
  }

  private getDistance(npc1: INPC, npc2: INPC): number {
    const dx = npc1.getPosition().x - npc2.getPosition().x;
    const dy = npc1.getPosition().y - npc2.getPosition().y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  private checkCrowdDensity() {
    if (this.npcs.length > this.maxCapacity) {
      console.log("警告: 群衆密度が高すぎます！");
    }
  }
}

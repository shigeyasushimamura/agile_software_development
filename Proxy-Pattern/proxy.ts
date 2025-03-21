// AIエンティティの基本インターフェース
interface AIEntity {
  update(playerPosition: { x: number; y: number }): void;
  getPosition(): { x: number; y: number };
  getName(): string;
  isRealAI(): boolean;
  getDistance(playerPosition: { x: number; y: number }): number;
}

export class AIProxy implements AIEntity {
  private name: string;
  private position: { x: number; y: number };
  private activationDistance: number;

  constructor(
    name: string,
    x: number,
    y: number,
    activationDistance: number = 10
  ) {
    this.name = name;
    this.position = { x, y };
    this.activationDistance = activationDistance;
  }

  update(playerPosition: { x: number; y: number }): void {
    console.log(`🚧 ${this.name} は簡易処理中`);
  }

  getPosition(): { x: number; y: number } {
    return this.position;
  }

  getName(): string {
    return this.name;
  }

  isRealAI(): boolean {
    return false;
  }

  getDistance(playerPosition: { x: number; y: number }): number {
    const dx = this.position.x - playerPosition.x;
    const dy = this.position.y - playerPosition.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

class ActiveAI implements AIEntity {
  private name: string;
  private position: { x: number; y: number };

  constructor(name: string, x: number, y: number) {
    this.name = name;
    this.position = { x, y };
    console.log(`⚡ ${this.name} の詳細AIがアクティブ化！`);
  }

  update(playerPosition: { x: number; y: number }): void {
    const distance = this.getDistance(playerPosition);
    if (distance < 5) {
      console.log(`⚔️ ${this.name} がプレイヤーを攻撃！`);
    } else {
      console.log(`🚶‍♂️ ${this.name} が巡回中...`);
    }
  }

  getPosition(): { x: number; y: number } {
    return this.position;
  }

  getName(): string {
    return this.name;
  }

  isRealAI(): boolean {
    return true;
  }

  getDistance(playerPosition: { x: number; y: number }): number {
    const dx = this.position.x - playerPosition.x;
    const dy = this.position.y - playerPosition.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}
export class AIManager {
  public aiEntities: AIEntity[] = [];
  private playerPosition: { x: number; y: number } = { x: 0, y: 0 };
  private activationDistance: number = 10;
  private deactivationDistance: number = 15;

  constructor() {
    // this.aiEntities.push(new AIProxy("ゴブリン", 5, 5));
    // this.aiEntities.push(new AIProxy("オーク", 15, 15));
    // this.aiEntities.push(new AIProxy("スケルトン", 30, 30));
  }

  updateWorld(): void {
    console.log("🌍 ゲーム世界の更新...");
    this.aiEntities = this.aiEntities.map((ai) => this.handleAIState(ai));
    this.aiEntities.forEach((ai) => ai.update(this.playerPosition));
  }

  movePlayer(x: number, y: number): void {
    console.log(`🎮 プレイヤーが移動 (${x}, ${y})`);
    this.playerPosition = { x, y };
    this.updateWorld();
  }

  addAI(e: AIEntity): void {
    this.aiEntities.push(e);
  }

  private handleAIState(ai: AIEntity): AIEntity {
    const distance = ai.getDistance(this.playerPosition);

    if (!ai.isRealAI() && distance < this.activationDistance) {
      // Proxy → Real AI に変換
      console.log(`🔄 ${ai.getName()} を詳細AIに切り替え`);
      return new ActiveAI(ai.getName(), ai.getPosition().x, ai.getPosition().y);
    } else {
      // Real AI → Proxy に戻す
      console.log(`🔄 ${ai.getName()} をProxyに戻す`);
      return new AIProxy(ai.getName(), ai.getPosition().x, ai.getPosition().y);
    }
  }
}

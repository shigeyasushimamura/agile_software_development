export interface NPC {
  move(): void;
  attack(): void;
  defend(): void;
}

export class Soldier implements NPC {
  move() {
    console.log("🛡️ Soldier: 前進する！");
  }
  attack() {
    console.log("🗡️ Soldier: 近接攻撃！");
  }
  defend() {
    console.log("🛡️ Soldier: 防御態勢を取る！");
  }
}

export class Archer implements NPC {
  move() {
    console.log("🏹 Archer: 位置を変える！");
  }
  attack() {
    console.log("🏹 Archer: 遠距離攻撃！");
  }
  defend() {
    console.log("🏹 Archer: 隠れる！");
  }
}

export class NPCFacade {
  private npcs: NPC[] = [];
  addNPC(npc: NPC) {
    this.npcs.push(npc);
  }

  moveAll() {
    console.log("🚶 全 NPC を移動させる...");
    this.npcs.forEach((npc) => npc.move());
  }

  attackAll() {
    console.log("⚔️ 全 NPC が攻撃する...");
    this.npcs.forEach((npc) => npc.attack());
  }

  defendAll() {
    console.log("🛡️ 全 NPC が防御する...");
    this.npcs.forEach((npc) => npc.defend());
  }
}

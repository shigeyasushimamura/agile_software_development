import { EnemyUnit } from "./facadeAndMediator.js";

export interface EnemyActionStrategy {
  execute(unit: EnemyUnit): void;
}

export class MeleeAttackStrategy implements EnemyActionStrategy {
  execute(unit: EnemyUnit) {
    console.log(`${unit.getName()}は近接攻撃を仕掛ける！`);
  }
}

export class RangedAttackStrategy implements EnemyActionStrategy {
  execute(unit: EnemyUnit) {
    console.log(`${unit.getName()}は遠距離攻撃を放つ！`);
  }
}

export class DefendStrategy implements EnemyActionStrategy {
  execute(unit: EnemyUnit) {
    console.log(`${unit.getName()}は防御態勢を取る！`);
  }
}

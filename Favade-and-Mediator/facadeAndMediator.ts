import { EnemyActionStrategy, MeleeAttackStrategy } from "./actionStrategy.js";

export class Army {
  private mediator: ArmyMediator = new ArmyMediator();

  addTroop(group: EnemyGroup) {
    this.mediator.addTroop(group);
  }

  executeGroups() {
    console.log("全軍の出撃命令!");
    this.mediator.coordinateGroups();
  }
}

export class ArmyMediator {
  private groups: EnemyGroup[] = [];
  addTroop(group: EnemyGroup) {
    this.groups.push(group);
  }

  coordinateGroups() {
    console.log("全軍のグループ間で連携開始！");
    for (const grp of this.groups) {
      grp.executeUnits();
    }
  }
}

export class EnemyGroup {
  private mediator = new EnemyGroupMediator();

  constructor(private name: string) {}

  addUnit(unit: EnemyUnit) {
    console.log(`${this.name}に${unit}を追加`);
    this.mediator.addUnit(unit);
  }

  executeUnits() {
    console.log("部隊毎の命令を実行！");
    this.mediator.coordinateUnits();
  }

  attack() {
    console.log(`${this.name}の全ユニットが攻撃を開始`);
    this.mediator.attackAll();
  }
}

export class EnemyGroupMediator {
  private units: EnemyUnit[] = [];

  addUnit(unit: EnemyUnit) {
    unit.setMediator(this);
    this.units.push(unit);
  }

  coordinateUnits() {
    console.log("ユニットに命令！");
    for (const unit of this.units) {
      unit.act();
    }
  }

  attackAll() {
    for (const unit of this.units) {
      unit.attack();
    }
  }

  defendAll() {
    for (const unit of this.units) {
      unit.defend();
    }
  }

  notify(sender: EnemyUnit, event: string) {
    if (event === "under_attack") {
      console.log("グループが攻撃を受けた!防御態勢を取る!");
      for (const unit of this.units) {
        unit.defend();
      }
    }
  }
}

export class EnemyUnit {
  private mediator?: EnemyGroupMediator;
  private availableStrategies: EnemyActionStrategy[];
  private currentStrategy: EnemyActionStrategy;
  constructor(
    private name: string,
    strategies: EnemyActionStrategy[] = [new MeleeAttackStrategy()]
  ) {
    this.availableStrategies = strategies;
    this.currentStrategy = this.decideStrategy(); // 初期戦略を決定
  }

  setMediator(mediator: EnemyGroupMediator) {
    this.mediator = mediator;
  }

  decideStrategy(): EnemyActionStrategy {
    const index = Math.floor(Math.random() * this.availableStrategies.length);
    return this.availableStrategies[index];
  }

  act() {
    this.currentStrategy = this.decideStrategy(); // 行動ごとに戦略を決定

    this.currentStrategy.execute(this);
  }

  getName() {
    return this.name;
  }

  takeDamage() {
    console.log(`${this.name}が攻撃を受けた`);
    this.mediator?.notify(this, "under_attack");
  }

  attack() {
    console.log(`${this.name}が攻撃する！`);
  }

  defend() {
    console.log(`${this.name}が防御する！`);
  }
}

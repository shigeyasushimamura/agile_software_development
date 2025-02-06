import { expect, vi, describe, it } from "vitest";
import { Army, EnemyGroup, EnemyUnit } from "./facadeAndMediator.js";
import {
  DefendStrategy,
  MeleeAttackStrategy,
  RangedAttackStrategy,
} from "./actionStrategy.js";

describe("facade and mediator", () => {
  it("normal", () => {
    const gropuA = new EnemyGroup("グループA");
    const groupB = new EnemyGroup("グループB");

    const soldier = new EnemyUnit("歩兵", [
      new MeleeAttackStrategy(),
      new DefendStrategy(),
    ]);
    const archer = new EnemyUnit("弓兵", [
      new RangedAttackStrategy(),
      new DefendStrategy(),
    ]);

    const consoleSpy = vi.spyOn(console, "log");

    gropuA.addUnit(soldier);
    groupB.addUnit(soldier);
    gropuA.addUnit(archer);

    gropuA.attack();
    groupB.attack();

    const army = new Army();
    army.addTroop(gropuA);
    army.addTroop(groupB);
    army.executeGroups();

    expect(consoleSpy).toHaveBeenCalledWith(
      "グループAの全ユニットが攻撃を開始"
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      "グループBの全ユニットが攻撃を開始"
    );
    expect(consoleSpy).toHaveBeenCalledWith("全軍の出撃命令!");
    expect(consoleSpy).toHaveBeenCalledWith("全軍のグループ間で連携開始！");
  });
});

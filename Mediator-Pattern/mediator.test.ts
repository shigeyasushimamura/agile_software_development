import { expect, describe, it, vi, beforeEach, afterEach } from "vitest";
import { EnemyMediator, Enemy, NPCMediator, NPC } from "./mediator.js";

describe("mediator", () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockReset();
  });

  it("commander ai", () => {
    const mediator = new EnemyMediator();
    const enemyA = new Enemy("EnemyA", mediator);
    const enemyB = new Enemy("EnemyB", mediator);
    const enemyC = new Enemy("EnemyC", mediator);

    mediator.addEnemy(enemyA);
    mediator.addEnemy(enemyB);
    mediator.addEnemy(enemyC);

    enemyA.spotPlayer();

    expect(consoleSpy).toHaveBeenCalledWith("EnemyA: プレイヤーを発見！");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Mediator: プレイヤーを発見した！各自迎撃指令を出す！"
    );
  });

  it("crowd normal", () => {
    const npcMediator = new NPCMediator(3);
    const npc1 = new NPC("NPC 1", npcMediator);
    const npc2 = new NPC("NPC 2", npcMediator);
    const npc3 = new NPC("NPC 3", npcMediator);
    const npc4 = new NPC("NPC 4", npcMediator); // 4人目は入れない

    npcMediator.addNPC(npc1);
    npcMediator.addNPC(npc2);
    npcMediator.addNPC(npc3);
    npcMediator.addNPC(npc4); // 入れない

    npc1.enterArea();
    npc2.enterArea();
    npc3.enterArea();
    npc4.enterArea(); // 入れない

    // console.log("npc1:", npc1.getPosition());

    npc1.updateState("running"); // 走り始める
    npc2.updateState("resting"); // 休憩

    npc1.move(30, 40); // 移動
    npc2.move(35, 45); // 移動

    npcMediator.handleProximity(npc1); // 近距離のNPCをチェック
    npcMediator.handleProximity(npc2); // 近距離のNPCをチェック

    npc1.leaveArea();
    npc2.leaveArea();
    // console.log("npc1:", npc1.getPosition());
    expect(npc1.getPosition()).toEqual({ x: 30, y: 40 });
  });
});

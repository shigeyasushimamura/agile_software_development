import { expect, describe, it, vi, beforeEach, afterEach } from "vitest";
import { Archer, NPCFacade, Soldier } from "./gameAIFacade.js";

describe("gameAI Facade", () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockReset();
  });

  it("normal", () => {
    const npcFacade = new NPCFacade();
    npcFacade.addNPC(new Soldier());
    npcFacade.addNPC(new Archer());

    npcFacade.moveAll();

    expect(consoleSpy).toHaveBeenCalledWith("🚶 全 NPC を移動させる...");
    expect(consoleSpy).toHaveBeenCalledWith("🛡️ Soldier: 前進する！");
    expect(consoleSpy).toHaveBeenCalledWith("🏹 Archer: 位置を変える！");
  });
});

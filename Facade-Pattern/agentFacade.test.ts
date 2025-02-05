import { expect, vi, describe, it, beforeEach, afterEach } from "vitest";
import { AgentController, Agent } from "./agentController.js";
import { AgentFacade } from "./agentFacade.js";

describe("facade", () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;
  let randomSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    randomSpy = vi.spyOn(Math, "random").mockImplementation(() => 0);
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    randomSpy.mockRestore();
  });

  it("normal", () => {
    // const agent1 = new Agent("hoge")
    // const agent2 = new Agent("fuga")

    // const agentController = new AgentController([])
    const agentFacade = new AgentFacade();
    agentFacade.addAgent("hoge");
    agentFacade.addAgent("fuga");

    agentFacade.greetAgents();

    // console.log に出力された内容を確認
    expect(consoleSpy).toHaveBeenCalledWith("hello, i am hoge");
    expect(consoleSpy).toHaveBeenCalledWith("hello, i am fuga");

    // 呼び出し回数の確認 (2回呼ばれるはず)
    expect(consoleSpy).toHaveBeenCalledTimes(2);
  });

  it("random called", () => {
    const agentFacade = new AgentFacade();
    agentFacade.addAgent("hoge");
    agentFacade.addAgent("fuga");

    agentFacade.greetRandomAgent();

    expect(consoleSpy).toHaveBeenCalledWith("hello, i am hoge");
    expect(consoleSpy).toHaveBeenCalledTimes(1);

    randomSpy.mockClear();
    randomSpy.mockImplementation(() => 0.999);

    agentFacade.greetRandomAgent();
    expect(consoleSpy).toHaveBeenCalledWith("hello, i am fuga");
    expect(consoleSpy).toHaveBeenCalledTimes(2);
  });
});

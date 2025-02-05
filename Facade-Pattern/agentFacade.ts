import { AgentController, Agent } from "./agentController.js";

export class AgentFacade {
  private agentController: AgentController;

  constructor() {
    this.agentController = new AgentController([]);
  }

  addAgent(name: string) {
    const agent = new Agent(name);
    this.agentController.addAgent(agent);
  }

  listAgents(): string[] {
    return this.agentController.getAgentList().map((agent) => agent.getName());
  }

  greetAgents() {
    this.agentController.getAgentList().forEach((agent) => agent.hello());
  }

  greetRandomAgent() {
    const agents = this.agentController.getAgentList();
    if (agents.length > 0) {
      const random = agents[Math.floor(Math.random() * agents.length)];
      random.hello();
    }
  }
}

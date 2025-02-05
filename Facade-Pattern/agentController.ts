export class AgentController {
  private agentList: Agent[] = [];

  constructor(agents: Agent[]) {
    this.agentList = agents;
  }

  addAgent(agent: Agent) {
    this.agentList.push(agent);
  }

  getAgentList() {
    return this.agentList;
  }
}

export class Agent {
  constructor(private name: string) {}

  getName() {
    return this.name;
  }

  hello() {
    console.log(`hello, i am ${this.name}`);
  }
}

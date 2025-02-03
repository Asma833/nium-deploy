export interface AgentReport {
    id: string;
    agentId: string;
    title: string;
    description: string;
    createdAt: string;
    // add other fields as necessary
  }
  
  export interface NewReport {
    agentId: string;
    title: string;
    description: string;
    // add any additional fields needed for creation
  }
  
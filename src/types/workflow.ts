export interface WorkflowStep {
  id: string;
  name: string;
  role: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  isActive: boolean;
  createdAt: string;
}

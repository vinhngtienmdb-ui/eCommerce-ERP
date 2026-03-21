import { create } from 'zustand';
import { Workflow } from '../types/workflow';

interface WorkflowStore {
  workflows: Workflow[];
  addWorkflow: (workflow: Workflow) => void;
  updateWorkflow: (workflow: Workflow) => void;
  deleteWorkflow: (id: string) => void;
  toggleWorkflow: (id: string) => void;
}

export const useWorkflowStore = create<WorkflowStore>((set) => ({
  workflows: [
    { 
      id: 'wf-1', 
      name: 'Quy trình thanh toán', 
      description: 'Quy trình duyệt thanh toán dịch vụ', 
      steps: [{id: 's1', name: 'Kế toán', role: 'accountant'}], 
      isActive: true, 
      createdAt: '2026-03-20' 
    }
  ],
  addWorkflow: (workflow) => set((state) => ({ workflows: [...state.workflows, workflow] })),
  updateWorkflow: (workflow) => set((state) => ({ workflows: state.workflows.map(w => w.id === workflow.id ? workflow : w) })),
  deleteWorkflow: (id) => set((state) => ({ workflows: state.workflows.filter(w => w.id !== id) })),
  toggleWorkflow: (id) => set((state) => ({ workflows: state.workflows.map(w => w.id === id ? { ...w, isActive: !w.isActive } : w) })),
}));

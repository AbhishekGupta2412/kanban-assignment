/**
 * Defines the priority levels for a task.
 */
export type Priority = "low" | "medium" | "high" | "urgent";

/**
 * [cite_start]Defines the structure for a single task [cite: 134-144].
 */
export interface KanbanTask {
  id: string;
  title: string;
  description?: string;
  status: string; // This is the column identifier
  priority?: Priority;
  assignee?: string;
  tags?: string[];
  createdAt: string; // Use ISO string format for dates
  dueDate?: string; // Use ISO string format for dates
}

/**
 * [cite_start]Defines the structure for a single column [cite: 145-151].
 */
export interface KanbanColumn {
  id: string;
  title: string;
  color: string; // As required by sample data
  taskIds: string[]; // Ordered list of task IDs
  maxTasks?: number; // For WIP limit
}

/**
 * [cite_start]Defines the props for the main KanbanBoard component [cite: 152-158].
 */
export interface KanbanViewProps {
  columns: KanbanColumn[];
  tasks: Record<string, KanbanTask>;
  onTaskMove: (
    taskId: string,
    fromColumn: string,
    toColumn: string,
    newIndex: number
  ) => void;
  onTaskCreate: (
    columnId: string,
    taskData: Omit<KanbanTask, "id" | "createdAt" | "status">
  ) => void;
  onTaskUpdate: (taskId: string, updates: Partial<KanbanTask>) => void;
  onTaskDelete: (taskId: string) => void;
}

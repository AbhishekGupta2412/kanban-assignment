import React from "react";
// This is the fix: import from '@storybook/react-vite'
import type { Meta, StoryObj } from "@storybook/react";
import { KanbanBoard } from "./KanbanBoard";
import { useKanbanBoard } from "@/hooks/useKanbanBoard";
import type { KanbanColumn, KanbanTask } from "./KanbanBoard.types";

// Using sample data from the PDF Appendix
const sampleColumns: KanbanColumn[] = [
  {
    id: "todo",
    title: "To Do",
    color: "#3b82f6", // Blue
    taskIds: ["task-1", "task-2"],
    maxTasks: 10,
  },
  {
    id: "in-progress",
    title: "In Progress",
    color: "#f59e0b", // Yellow
    taskIds: ["task-3"],
    maxTasks: 5,
  },
  {
    id: "review",
    title: "Review",
    color: "#6366f1", // Indigo
    taskIds: [],
    maxTasks: 3,
  },
  {
    id: "done",
    title: "Done",
    color: "#10b981", // Green
    taskIds: ["task-4", "task-5"],
  },
];

const sampleTasks: Record<string, KanbanTask> = {
  "task-1": {
    id: "task-1",
    title: "Implement drag and drop functionality",
    description: "Use dnd-kit/core as allowed.",
    status: "todo",
    priority: "high",
    assignee: "Alex Smith",
    tags: ["frontend", "feature"],
    createdAt: new Date("2025-10-20T10:00:00Z").toISOString(),
    dueDate: new Date("2025-11-05T10:00:00Z").toISOString(),
  },
  "task-2": {
    id: "task-2",
    title: "Design task modal component",
    status: "todo",
    priority: "medium",
    assignee: "Jamie Lee",
    tags: ["design", "ui"],
    createdAt: new Date("2025-10-21T10:00:00Z").toISOString(),
  },
  "task-3": {
    id: "task-3",
    title: "Setup TypeScript and Tailwind config",
    status: "in-progress",
    priority: "urgent",
    assignee: "Alex Smith",
    tags: ["setup"],
    createdAt: new Date("2025-10-19T10:00:00Z").toISOString(),
  },
  "task-4": {
    id: "task-4",
    title: "Create project structure",
    description: "Setup folders for components, hooks, and utils.",
    status: "done",
    priority: "low",
    assignee: "Jamie Lee",
    tags: ["setup"],
    createdAt: new Date("2025-10-18T10:00:00Z").toISOString(),
  },
  "task-5": {
    id: "task-5",
    title: "Install dependencies (React, Storybook)",
    status: "done",
    priority: "low",
    assignee: "Chris Wong",
    tags: ["setup"],
    createdAt: new Date("2025-10-18T09:00:00Z").toISOString(),
  },
};

const meta: Meta<typeof KanbanBoard> = {
  title: "Components/KanbanBoard",
  component: KanbanBoard,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof KanbanBoard>;

// Wrapper component to manage state within Storybook
const KanbanBoardWithHooks: React.FC<{
  cols?: KanbanColumn[];
  tasksData?: Record<string, KanbanTask>;
}> = ({ cols = sampleColumns, tasksData = sampleTasks }) => {
  const { columns, tasks, ...handlers } = useKanbanBoard(cols, tasksData);
  return <KanbanBoard columns={columns} tasks={tasks} {...handlers} />;
};

/**
 * Default story: Shows the board with sample data.
 */
export const Default: Story = {
  name: "1. Default Board",
  render: () => <KanbanBoardWithHooks />,
};

/**
 * Empty state story: Shows the board with no tasks.
 */
export const Empty: Story = {
  name: "2. Empty State",
  render: () => {
    const emptyCols = sampleColumns.map((c) => ({ ...c, taskIds: [] }));
    return <KanbanBoardWithHooks cols={emptyCols} tasksData={{}} />;
  },
};

/**
 * WIP Limit Story: Shows a column at its WIP limit.
 */
export const WipLimit: Story = {
  name: "3. WIP Limit Reached",
  render: () => {
    const wipCols: KanbanColumn[] = [
      {
        id: "review",
        title: "Review (Limit 3)",
        color: "#f59e0b",
        taskIds: ["task-1", "task-2", "task-3"],
        maxTasks: 3, // WIP Limit set
      },
      { id: "done", title: "Done", color: "#10b981", taskIds: [] },
    ];
    const wipTasks: Record<string, KanbanTask> = {
      "task-1": { ...sampleTasks["task-1"], status: "review" },
      "task-2": { ...sampleTasks["task-2"], status: "review" },
      "task-3": { ...sampleTasks["task-3"], status: "review" },
    };
    return <KanbanBoardWithHooks cols={wipCols} tasksData={wipTasks} />;
  },
};

/**
 * Large Dataset Story: For testing performance.
 */
const largeTasks: Record<string, KanbanTask> = {};
const largeTaskIds: string[] = [];
for (let i = 0; i < 50; i++) {
  const id = `large-task-${i}`;
  largeTaskIds.push(id);
  largeTasks[id] = {
    id: id,
    title: `Task ${i + 1}`,
    status: "todo",
    priority: "medium",
    createdAt: new Date().toISOString(),
  };
}
const largeCols: KanbanColumn[] = [
  { ...sampleColumns[0], taskIds: largeTaskIds },
  { ...sampleColumns[1], taskIds: [] },
  { ...sampleColumns[2], taskIds: [] },
];

export const LargeDataset: Story = {
  name: "4. Large Dataset (50+ Tasks)",
  render: () => (
    <KanbanBoardWithHooks cols={largeCols} tasksData={largeTasks} />
  ),
};
export const MobileView: Story = {
  name: "5. Mobile View",
  render: () => <KanbanBoardWithHooks />,
  parameters: {
    // This simulates a mobile phone viewport
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

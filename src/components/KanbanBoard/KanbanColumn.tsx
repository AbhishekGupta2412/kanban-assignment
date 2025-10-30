import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import type {
  KanbanColumn as KanbanColumnType,
  KanbanTask,
} from "./KanbanBoard.types";
import { KanbanCard } from "./KanbanCard";
import { Button } from "../primitives/Button";
import { clsx } from "clsx";

interface KanbanColumnProps {
  column: KanbanColumnType;
  tasks: KanbanTask[];
  onEditTask: (taskId: string) => void;
  onAddTask: (columnId: string) => void;
}

// --- Virtualized Row Component (Same as before) ---
const CardRow = ({
  index,
  style,
  data,
}: {
  index: number;
  style: React.CSSProperties;
  data: {
    tasks: KanbanTask[];
    onEditTask: (id: string) => void;
  };
}) => {
  const { tasks, onEditTask } = data;
  const task = tasks[index];

  const { setNodeRef } = useDroppable({
    id: task.id,
    data: { ...task, type: "card" },
  });

  return (
    <div style={style} ref={setNodeRef} className="p-1.5">
      <KanbanCard task={task} onEdit={onEditTask} />
    </div>
  );
};
// ---------------------------------

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  tasks,
  onEditTask,
  onAddTask,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { ...column, type: "column" },
  });

  const taskCount = tasks.length;
  const wipLimit = column.maxTasks;
  const atWipLimit = wipLimit !== undefined && taskCount >= wipLimit;

  const CARD_HEIGHT = 150;

  return (
    <div
      aria-label={`${column.title} column. ${taskCount} tasks.`}
      // --- THIS IS THE RESPONSIVE CHANGE ---
      className="flex flex-col w-[90vw] md:w-80 flex-shrink-0 max-h-full bg-neutral-100/70 rounded-xl"
      // ------------------------------------
    >
      {/* Column Header */}
      <div className="sticky top-0 z-10 p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: column.color }}
            />
            <h3 className="font-semibold text-neutral-900">{column.title}</h3>
          </div>
          <span
            className={`text-sm font-medium ${
              atWipLimit ? "text-red-600" : "text-neutral-700"
            }`}
          >
            {taskCount}
            {wipLimit !== undefined && ` / ${wipLimit}`}
          </span>
        </div>
      </div>

      {/* --- Task List (with AutoSizer) --- */}
      <div
        ref={setNodeRef}
        className={clsx(
          "flex-1 overflow-y-auto p-1.5",
          isOver && "bg-neutral-200/50"
        )}
      >
        {tasks.length === 0 ? (
          <div className="text-center text-sm text-neutral-700 p-4 border-2 border-dashed border-neutral-200 rounded-lg">
            No tasks yet.
          </div>
        ) : (
          <AutoSizer>
            {({ height, width }) => (
              <FixedSizeList
                height={height}
                width={width}
                itemCount={taskCount}
                itemSize={CARD_HEIGHT}
                itemData={{ tasks, onEditTask }}
              >
                {CardRow}
              </FixedSizeList>
            )}
          </AutoSizer>
        )}
      </div>

      {/* Add Task Button */}
      <div className="sticky bottom-0 p-3 mt-1">
        <Button
          variant="secondary"
          fullWidth
          onClick={() => onAddTask(column.id)}
          disabled={atWipLimit}
        >
          + Add Task
        </Button>
      </div>
    </div>
  );
};

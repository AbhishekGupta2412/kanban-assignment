import React from "react";
import { useDraggable } from "@dnd-kit/core";
import type { KanbanTask } from "./KanbanBoard.types";
import { formatDate, getPriorityClasses, isOverdue } from "@/utils/task.utils";
import { Avatar } from "../primitives/Avatar";
import { clsx } from "clsx";

interface KanbanCardProps {
  task: KanbanTask;
  onEdit: (taskId: string) => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = React.memo(
  ({ task, onEdit }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } =
      useDraggable({
        id: task.id,
        data: { ...task }, // Pass the full task object
      });

    // This style applies the 'transform' while dragging
    const style = transform
      ? {
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        }
      : undefined;

    const overdue = isOverdue(task.dueDate);

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        role="button"
        tabIndex={0}
        aria-label={`${task.title}. Priority: ${
          task.priority || "none"
        }. Status: ${task.status}.`}
        onClick={() => onEdit(task.id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onEdit(task.id);
        }}
        className={clsx(
          `bg-white border border-neutral-200 rounded-xl p-3 shadow-sm
          hover:shadow-md transition-shadow duration-200 cursor-grab`,
          getPriorityClasses(task.priority),
          isDragging && "opacity-30" // This creates the "placeholder" effect
        )}
      >
        {/* Title */}
        <h4 className="font-medium text-sm text-neutral-900 line-clamp-2">
          {task.title}
        </h4>

        {/* Description Snippet */}
        {task.description && (
          <p className="text-xs text-neutral-700 mt-1 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {task.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer: Due Date & Assignee */}
        <div className="flex items-center justify-between mt-3">
          {task.dueDate ? (
            <span
              className={`text-xs font-medium ${
                overdue ? "text-red-600" : "text-neutral-700"
              }`}
            >
              {formatDate(task.dueDate)}
            </span>
          ) : (
            <span /> // Empty span to keep justify-between
          )}

          {task.assignee && <Avatar name={task.assignee} />}
        </div>
      </div>
    );
  }
);

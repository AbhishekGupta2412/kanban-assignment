import { useState, useCallback } from "react";
import {
  KanbanColumn,
  KanbanTask,
} from "@/components/KanbanBoard/KanbanBoard.types";

/**
 * [cite_start]A hook to manage the state of the Kanban board[cite: 76].
 * It takes the initial state and returns state + handler functions.
 */
export const useKanbanBoard = (
  initialColumns: KanbanColumn[],
  initialTasks: Record<string, KanbanTask>
) => {
  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns);
  const [tasks, setTasks] = useState<Record<string, KanbanTask>>(initialTasks);

  /**
   * Creates a new task.
   */
  const onTaskCreate = useCallback(
    (
      columnId: string,
      taskData: Omit<KanbanTask, "id" | "createdAt" | "status">
    ) => {
      const newTaskId = `task-${Date.now()}`;
      const newTask: KanbanTask = {
        ...taskData,
        id: newTaskId,
        status: columnId,
        createdAt: new Date().toISOString(),
      };

      // Add to tasks map
      setTasks((prev) => ({ ...prev, [newTaskId]: newTask }));

      // Add task ID to the top of the correct column
      setColumns((prev) =>
        prev.map((col) =>
          col.id === columnId
            ? { ...col, taskIds: [newTaskId, ...col.taskIds] }
            : col
        )
      );
    },
    []
  );

  /**
   * Updates an existing task.
   */
  const onTaskUpdate = useCallback(
    (taskId: string, updates: Partial<KanbanTask>) => {
      setTasks((prev) => {
        if (!prev[taskId]) return prev;
        return {
          ...prev,
          [taskId]: { ...prev[taskId], ...updates },
        };
      });
    },
    []
  );

  /**
   * Deletes a task.
   */
  const onTaskDelete = useCallback((taskId: string) => {
    // Remove from tasks map
    setTasks((prev) => {
      const newState = { ...prev };
      delete newState[taskId];
      return newState;
    });

    // Remove from all column taskIds arrays
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        taskIds: col.taskIds.filter((id) => id !== taskId),
      }))
    );
  }, []);

  /**
   * Moves a task between or within columns.
   * This will be used by our drag-and-drop hook later.
   */
  const onTaskMove = useCallback(
    (
      taskId: string,
      fromColumnId: string,
      toColumnId: string,
      newIndex: number
    ) => {
      setColumns((prev) => {
        const fromCol = prev.find((c) => c.id === fromColumnId);
        const toCol = prev.find((c) => c.id === toColumnId);
        if (!fromCol || !toCol) return prev;

        const newColumns = [...prev];

        // Same column reorder
        if (fromColumnId === toColumnId) {
          const colIndex = prev.findIndex((c) => c.id === fromColumnId);
          const newTasks = Array.from(fromCol.taskIds);
          const [movedTask] = newTasks.splice(newTasks.indexOf(taskId), 1);
          newTasks.splice(newIndex, 0, movedTask);
          newColumns[colIndex] = { ...fromCol, taskIds: newTasks };
        } else {
          // Move between columns
          const fromColIndex = prev.findIndex((c) => c.id === fromColumnId);
          const toColIndex = prev.findIndex((c) => c.id === toColumnId);

          // Remove from source
          const newFromTasks = fromCol.taskIds.filter((id) => id !== taskId);
          newColumns[fromColIndex] = { ...fromCol, taskIds: newFromTasks };

          // Add to destination
          const newToTasks = Array.from(toCol.taskIds);
          newToTasks.splice(newIndex, 0, taskId);
          newColumns[toColIndex] = { ...toCol, taskIds: newToTasks };
        }
        return newColumns;
      });

      if (fromColumnId !== toColumnId) {
        onTaskUpdate(taskId, { status: toColumnId });
      }
    },
    [onTaskUpdate]
  );

  return {
    columns,
    tasks,
    onTaskCreate,
    onTaskUpdate,
    onTaskDelete,
    onTaskMove,
  };
};

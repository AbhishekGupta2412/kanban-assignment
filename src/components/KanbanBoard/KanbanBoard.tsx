import React, { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import type { KanbanViewProps, KanbanTask } from "./KanbanBoard.types";
import { KanbanColumn } from "./KanbanColumn";
import { TaskModal } from "./TaskModal";
import { KanbanCard } from "./KanbanCard";

export const KanbanBoard: React.FC<KanbanViewProps> = ({
  columns,
  tasks,
  onTaskMove,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
}) => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    taskToEdit?: string;
    columnId?: string;
  }>({ isOpen: false });

  const [activeTask, setActiveTask] = useState<KanbanTask | null>(null);

  // --- NEW: State for the search filter ---
  const [searchTerm, setSearchTerm] = useState("");
  // ----------------------------------------

  // --- UPDATED: Memoized tasks ---
  const tasksByColumn = useMemo(() => {
    // First, filter all tasks based on the search term
    const filteredTasks = Object.values(tasks).filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Now, group the *filtered* tasks by column
    const map: Record<string, KanbanTask[]> = {};
    for (const col of columns) {
      // Get the tasks for this column, but only include those that passed the filter
      const columnTasks = col.taskIds
        .map((taskId) => tasks[taskId])
        .filter(
          (task) => task && filteredTasks.some((ft) => ft.id === task.id)
        );
      map[col.id] = columnTasks;
    }
    return map;
  }, [columns, tasks, searchTerm]); // Add searchTerm as a dependency
  // -------------------------------

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const task = tasks[active.id as string];
    if (task) {
      setActiveTask(task);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTask(null);

    if (!over || active.id === over.id) {
      return;
    }

    const fromColumn = (active.data.current as KanbanTask).status;
    const taskId = active.id as string;

    let toColumn: string;
    let newIndex: number;

    const overData = over.data.current as any;

    if (overData.type === "column") {
      toColumn = over.id as string;
      newIndex = 0;
    } else {
      const overTask = overData as KanbanTask;
      toColumn = overTask.status;
      const toColTasks = tasksByColumn[toColumn]?.map((t) => t.id) || [];
      newIndex = toColTasks.indexOf(overTask.id);
    }

    onTaskMove(taskId, fromColumn, toColumn, newIndex);
  }

  const handleOpenEditModal = (taskId: string) => {
    setModalState({ isOpen: true, taskToEdit: taskId });
  };

  const handleOpenCreateModal = (columnId: string) => {
    setModalState({ isOpen: true, columnId: columnId });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false });
  };

  const taskToEdit = modalState.taskToEdit
    ? tasks[modalState.taskToEdit]
    : undefined;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveTask(null)}
    >
      <div className="p-4 md:p-6 bg-neutral-50 h-screen w-full overflow-hidden flex flex-col">
        {/* --- NEW: Search Bar --- */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search tasks by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-sm p-2 border border-neutral-300 rounded-lg shadow-sm"
          />
        </div>
        {/* ----------------------- */}

        {/* Column Container */}
        <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
          {columns.map((col) => (
            <KanbanColumn
              key={col.id}
              column={col}
              tasks={tasksByColumn[col.id] || []}
              onEditTask={handleOpenEditModal}
              onAddTask={handleOpenCreateModal}
            />
          ))}
        </div>
      </div>

      <DragOverlay>
        {activeTask ? <KanbanCard task={activeTask} onEdit={() => {}} /> : null}
      </DragOverlay>

      <TaskModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        taskToEdit={taskToEdit}
        columnId={modalState.columnId}
        onSave={(taskData) => {
          if (modalState.columnId) {
            onTaskCreate(modalState.columnId, taskData);
          }
        }}
        onUpdate={onTaskUpdate}
        onDelete={onTaskDelete}
      />
    </DndContext>
  );
};

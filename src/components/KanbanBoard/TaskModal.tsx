import React, { useState, useEffect } from "react";
import { KanbanTask, Priority } from "./KanbanBoard.types";
import { Modal } from "../primitives/Modal";
import { Button } from "../primitives/Button";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Omit<KanbanTask, "id" | "createdAt" | "status">) => void;
  onUpdate: (taskId: string, updates: Partial<KanbanTask>) => void;
  onDelete: (taskId: string) => void;
  taskToEdit?: KanbanTask; // Pass this if editing
  columnId?: string; // Pass this if creating
}

const priorities: Priority[] = ["low", "medium", "high", "urgent"];

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  onDelete,
  taskToEdit,
  columnId,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [assignee, setAssignee] = useState("");
  const [tags, setTags] = useState(""); // Simple comma-separated string
  const [dueDate, setDueDate] = useState("");

  const isEditing = !!taskToEdit;

  // Populate form when taskToEdit changes
  useEffect(() => {
    if (isEditing && taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || "");
      setPriority(taskToEdit.priority || "medium");
      setAssignee(taskToEdit.assignee || "");
      setTags((taskToEdit.tags || []).join(", "));
      setDueDate(taskToEdit.dueDate ? taskToEdit.dueDate.split("T")[0] : ""); // Format for <input type="date">
    } else {
      // Reset form for creating
      setTitle("");
      setDescription("");
      setPriority("medium");
      setAssignee("");
      setTags("");
      setDueDate("");
    }
  }, [taskToEdit, isEditing, isOpen]);

  const handleSave = () => {
    if (!title.trim()) {
      // Basic validation
      alert("Title is required.");
      return;
    }

    const taskData = {
      title: title,
      description,
      priority,
      assignee,
      tags: tags
        .split(",")
        .filter(Boolean)
        .map((t) => t.trim()), // [cite: 222]
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined, // [cite: 223]
    };

    if (isEditing && taskToEdit) {
      onUpdate(taskToEdit.id, taskData);
    } else if (columnId) {
      onSave(taskData);
    }
    onClose();
  };

  const handleDelete = () => {
    if (isEditing && taskToEdit) {
      // Add a confirmation before deleting
      if (
        window.confirm(`Are you sure you want to delete "${taskToEdit.title}"?`)
      ) {
        onDelete(taskToEdit.id);
        onClose();
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div className="p-6">
        <h2 id="modal-title" className="text-xl font-semibold text-neutral-900">
          {isEditing ? "Edit Task" : "Create New Task"}
        </h2>
        <div id="modal-description" className="sr-only">
          {isEditing ? "Update task details below" : "Create a new task"}
        </div>

        <div className="mt-4 space-y-4">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-neutral-700"
            >
              Title <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm p-2"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-neutral-700"
            >
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Priority */}
            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium text-neutral-700"
              >
                Priority
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm p-2 capitalize"
              >
                {priorities.map((p) => (
                  <option key={p} value={p} className="capitalize">
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label
                htmlFor="dueDate"
                className="block text-sm font-medium text-neutral-700"
              >
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm p-2"
              />
            </div>
          </div>

          {/* Assignee & Tags (simplified for this step) */}
          <div className="grid grid-cols-2 gap-4">
            {/* Assignee [cite: 221] */}
            <div>
              <label
                htmlFor="assignee"
                className="block text-sm font-medium text-neutral-700"
              >
                Assignee
              </label>
              <input
                type="text"
                id="assignee"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                placeholder="Assignee name..."
                className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm p-2"
              />
            </div>
            {/* Tags */}
            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-neutral-700"
              >
                Tags (comma-separated)
              </label>
              <input
                type="text"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="frontend, bug..."
                className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm p-2"
              />
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-neutral-200">
          <div>
            {isEditing && (
              <Button variant="danger" onClick={handleDelete}>
                Delete Task
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              {isEditing ? "Save Changes" : "Create Task"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

import { format, isPast, isToday } from "date-fns";
import { Priority } from "@/components/KanbanBoard/KanbanBoard.types";

/**
 * Checks if a due date is overdue.
 */
export const isOverdue = (dueDate?: string): boolean => {
  if (!dueDate) return false;
  try {
    const date = new Date(dueDate);
    return isPast(date) && !isToday(date);
  } catch {
    return false;
  }
};

/**
 * Formats an ISO date string into a readable format (e.g., "Oct 30, 2025").
 */
export const formatDate = (isoDate?: string): string => {
  if (!isoDate) return "";
  try {
    return format(new Date(isoDate), "MMM d, yyyy");
  } catch {
    return "Invalid Date";
  }
};

/**
 * Gets the first two initials from a name.
 */
export const getInitials = (name?: string): string => {
  if (!name) return "??";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

/**
 * [cite_start]Returns Tailwind classes for the task priority[cite: 165].
 */
export const getPriorityClasses = (priority?: Priority): string => {
  switch (priority) {
    case "urgent":
      // Red border
      return "border-l-4 border-red-500";
    case "high":
      // Orange border
      return "border-l-4 border-orange-500";
    case "medium":
      // Yellow border
      return "border-l-4 border-yellow-500";
    case "low":
      // Blue border
      return "border-l-4 border-blue-500";
    default:
      return "border-l-4 border-transparent";
  }
};

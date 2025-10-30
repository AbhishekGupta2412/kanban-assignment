import React from "react";
import { getInitials } from "@/utils/task.utils";

interface AvatarProps {
  name?: string;
}

/**
 * [cite_start]A simple circular Avatar component to display user initials[cite: 73, 166].
 */
export const Avatar: React.FC<AvatarProps> = React.memo(({ name }) => {
  return (
    <div
      title={name}
      className="w-6 h-6 bg-primary-500 text-white text-xs font-semibold
                 flex items-center justify-center rounded-full"
    >
      {getInitials(name)}
    </div>
  );
});

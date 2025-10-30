import React from "react";
import { clsx } from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  fullWidth = false,
  className,
  ...props
}) => {
  const baseStyles =
    "px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2";

  const variantStyles = {
    primary:
      "bg-primary-600 text-white hover:bg-primary-700 disabled:bg-primary-700/60",
    secondary:
      "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 disabled:bg-neutral-100/70",
    danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-600/70",
  };

  return (
    <button
      className={clsx(
        baseStyles,
        variantStyles[variant],
        fullWidth && "w-full",
        className
      )}
      {...props}
    />
  );
};

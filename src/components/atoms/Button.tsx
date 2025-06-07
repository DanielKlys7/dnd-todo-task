import classNames from "classnames";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Button = ({
  onClick,
  children,
  className,
  disabled,
  ...rest
}: ButtonProps) => (
  <button
    className={classNames(
      `px-4 py-3 border rounded-md focus:outline-none transition-colors duration-200`,
      {
        "bg-secondary hover:bg-accent text-text border-primary": !disabled,
        "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed":
          disabled,
      },
      className
    )}
    onClick={onClick}
    disabled={disabled}
    {...rest}
  >
    {children}
  </button>
);

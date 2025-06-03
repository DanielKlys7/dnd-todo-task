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
  ...rest
}: ButtonProps) => (
  <button
    className={classNames(
      `px-4 py-3 border bg-secondary hover:bg-accent text-text
      border-primary rounded-md focus:outline-none transition-colors duration-200`,
      className
    )}
    onClick={onClick}
    {...rest}
  >
    {children}
  </button>
);

import type { IconProps } from "./Icon.types";

export const Draggable = ({ width = 24, height = 24, ...rest }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 32 32"
      fill="currentcolor"
      version="1.1"
      id="icon"
      {...rest}
    >
      <rect x="10" y="6" width="4" height="4" />
      <rect x="18" y="6" width="4" height="4" />
      <rect x="10" y="14" width="4" height="4" />
      <rect x="18" y="14" width="4" height="4" />
      <rect x="10" y="22" width="4" height="4" />
      <rect x="18" y="22" width="4" height="4" />
    </svg>
  );
};

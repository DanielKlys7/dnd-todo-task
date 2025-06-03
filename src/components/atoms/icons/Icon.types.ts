import type { AriaAttributes } from "react";

export type IconProps = {
  className?: string;
  width?: number;
  height?: number;
} & Partial<AriaAttributes>;

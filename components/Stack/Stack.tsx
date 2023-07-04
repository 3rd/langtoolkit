import React from "react";
import { cn } from "@/lib/utils";
import type { ClassValue } from "clsx";

export type StackProps = {
  children?: React.ReactNode;
  className?: ClassValue | ClassValue[];
  direction?: "column-reverse" | "column" | "row-reverse" | "row";
  align?: "baseline" | "center" | "end" | "start" | "stretch";
  justify?: "around" | "between" | "center" | "end" | "evenly" | "start";
  gap?: number;
};

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ align, justify, children, className, direction, gap }, ref) => {
    const classes = cn(
      "flex",
      {
        "flex-row": direction === "row",
        "flex-row-reverse": direction === "row-reverse",
        "flex-col": direction === "column",
        "flex-col-reverse": direction === "column-reverse",
        "items-start": align === "start",
        "items-center": align === "center",
        "items-end": align === "end",
        "items-baseline": align === "baseline",
        "items-stretch": align === "stretch",
        "justify-start": justify === "start",
        "justify-center": justify === "center",
        "justify-end": justify === "end",
        "justify-between": justify === "between",
        "justify-around": justify === "around",
        "justify-evenly": justify === "evenly",
      },
      Number.isFinite(gap) && `gap-${gap}`,
      className
    );

    return (
      <div className={classes} ref={ref}>
        {children}
      </div>
    );
  }
);

Stack.displayName = "Stack";

import React from "react";
import { cn } from "@/lib/utils";
import { type ClassValue } from "clsx";

export type StackProps = {
  children?: React.ReactNode;
  className?: ClassValue | ClassValue[];
  direction?: "row" | "row-reverse" | "column" | "column-reverse";
  align?: "start" | "center" | "end" | "baseline" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  gap?: number;
};

export const Stack = ({ align, justify, children, className, direction, gap }: StackProps) => {
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

  return <div className={classes}>{children}</div>;
};

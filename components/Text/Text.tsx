import { cn } from "@/lib/utils";
import { type ClassValue } from "clsx";
import React from "react";

const config = {
  h1: { classes: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl", component: "h1" },
  h2: {
    classes: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0",
    component: "h2",
  },
  h3: { classes: "scroll-m-20 text-2xl font-semibold tracking-tight", component: "h3" },
  h4: { classes: "scroll-m-20 text-xl font-semibold tracking-tight", component: "h4" },
  p: { classes: "leading-7 [&:not(:first-child)]:mt-6", component: "p" },
  code: {
    classes: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
    component: "code",
  },
  lead: { classes: "text-xl text-muted-foreground", component: "p" },
  large: { classes: "text-lg font-semibold", component: "p" },
  small: { classes: "text-sm font-medium leading-none", component: "small" },
  muted: { classes: "text-sm text-muted-foreground", component: "p" },
  inline: { classes: "", component: "span" },
};

export type TextProps = {
  children?: React.ReactNode;
  className?: ClassValue | ClassValue[];
  component?: keyof HTMLElementTagNameMap;
  variant?: keyof typeof config;
};

export const Text = ({ children, className, component, variant = "p" }: TextProps) => {
  return React.createElement(
    component ?? config[variant].component,
    {
      className: cn(config[variant].classes, className),
    },
    children
  );
};

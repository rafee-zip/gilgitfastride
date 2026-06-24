import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium cursor-pointer transition-all duration-300 ease-[var(--ease-spring)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-foreground/10 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "shine bg-primary text-primary-foreground shadow-[0_1px_0_0_rgb(255_255_255_/_0.18)_inset,0_8px_24px_-10px_rgb(15_23_42_/_0.35)] hover:shadow-[0_1px_0_0_rgb(255_255_255_/_0.22)_inset,0_12px_30px_-10px_rgb(15_23_42_/_0.45)] hover:-translate-y-0.5",
        destructive:
          "bg-destructive text-destructive-foreground shadow-[0_8px_20px_-10px_rgb(220_38_38_/_0.5)] hover:-translate-y-0.5",
        outline:
          "border border-border bg-background/40 backdrop-blur-xl backdrop-saturate-150 text-foreground shadow-[var(--shadow-soft)] hover:bg-background/70 hover:-translate-y-0.5",
        secondary:
          "bg-secondary text-secondary-foreground backdrop-blur-xl backdrop-saturate-150 border border-border shadow-[var(--shadow-soft)] hover:-translate-y-0.5",
        ghost:
          "hover:bg-accent/70 hover:backdrop-blur-xl hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline rounded-md",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3.5 text-xs",
        lg: "h-12 px-7 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };

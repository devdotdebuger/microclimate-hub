"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/50 disabled:pointer-events-none disabled:opacity-50 threads-button",
  {
    variants: {
      variant: {
        default: "bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-600/25 hover:shadow-green-600/40",
        destructive: "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/25",
        outline:
          "border border-gray-700 bg-transparent hover:bg-white/5 hover:border-gray-600 text-gray-300 hover:text-white",
        secondary: "bg-[#2A2A2A] text-white hover:bg-[#333333] shadow-lg shadow-black/25",
        ghost: "hover:bg-white/5 hover:text-white text-gray-400",
        link: "text-green-500 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-lg px-4",
        lg: "h-12 rounded-xl px-8",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const EnhancedButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
EnhancedButton.displayName = "EnhancedButton"

export { EnhancedButton, buttonVariants }

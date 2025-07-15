import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { memo } from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "spinner" | "dots" | "pulse";
  className?: string;
  text?: string;
}

const LoadingSpinner = memo<LoadingSpinnerProps>(({
  size = "md",
  variant = "spinner",
  className,
  text
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12"
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg"
  };

  const renderSpinner = () => {
    switch (variant) {
      case "dots":
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  "bg-current rounded-full animate-pulse",
                  sizeClasses[size]
                )}
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: "1.4s"
                }}
              />
            ))}
          </div>
        );
      
      case "pulse":
        return (
          <div className={cn(
            "bg-current rounded-full animate-pulse",
            sizeClasses[size]
          )} />
        );
      
      default:
        return (
          <Loader2 
            className={cn(
              "animate-spin",
              sizeClasses[size]
            )} 
          />
        );
    }
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center space-y-2",
      className
    )}>
      {renderSpinner()}
      {text && (
        <p className={cn(
          "text-muted-foreground animate-pulse",
          textSizeClasses[size]
        )}>
          {text}
        </p>
      )}
    </div>
  );
});

LoadingSpinner.displayName = "LoadingSpinner";

export { LoadingSpinner }; 
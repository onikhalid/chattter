import * as React from "react"

import { cn } from "@/lib/utils"
import FormError from "./formError"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean
  errorMessage?: string
  errorMessageClass?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, hasError, errorMessage, errorMessageClass, ...props }, ref) => {
    return (
      <div className={cn("space-y-3")}>
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />

        {
          hasError && <FormError className={errorMessageClass} errorMessage={errorMessage} />
        }
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }

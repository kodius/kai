import { cn } from "@/lib/utils"
import { IconLoader } from "@tabler/icons-react"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <IconLoader role="status" aria-label="Loading" className={cn("size-4 animate-spin")} {...props} />
    </div>
  )
}

export { Spinner }

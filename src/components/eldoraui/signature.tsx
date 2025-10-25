"use client"
import Signature, { type SignatureRef } from "@uiw/react-signature"
import { type ComponentProps, useRef } from "react"
import { cn } from "@/lib/utils"

export function ReactSignature({ className, ...props }: ComponentProps<typeof Signature>) {
  const $svg = useRef<SignatureRef>(null)

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm tracking-tight text-neutral-500">Just sign here</p>
      <Signature
        className={cn(
          "max-h-20 w-80 rounded-lg border border-neutral-500/20 bg-neutral-500/10",
          "fill-neutral-800 dark:fill-neutral-200",
          className,
        )}
        options={{
          smoothing: 0,
          streamline: 0.8,
          thinning: 0.7,
        }}
        {...props}
        ref={$svg}
      />
    </div>
  )
}

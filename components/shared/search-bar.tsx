"use client"

import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

type Props = {
  value?: string
  onChange?: (v: string) => void
  placeholder?: string
  className?: string
}

export function SearchBar({ value = "", onChange = () => {}, placeholder = "Search...", className = "" }: Props) {
  return (
    <div className={className}>
      <div className="relative">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label="Search"
          className="pr-9"
        />
        {value && (
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => onChange("")}
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}

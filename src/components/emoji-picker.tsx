"use client"

import { Smile } from "lucide-react"
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,

 } from "./ui/popover"

interface EmojiPickerProps {
  onChange: (emoji: string) => void
}
const EmojiPicker = ({
  onChange
}: EmojiPickerProps) => {
  return (
    <Popover>
      <PopoverTrigger>
      <Smile className="text-muted dark:text-neutral-400 group-hover:text-accent-foreground dark:group-hover:text-accent-foreground transition" />
      </PopoverTrigger>
      <PopoverContent side="right">

      </PopoverContent>
    </Popover>
  )
}
export default EmojiPicker
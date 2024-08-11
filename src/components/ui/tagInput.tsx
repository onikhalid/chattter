"use client"
import React, { useState, useEffect } from 'react'
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Input } from './input'
import FormError from './formError'

interface TagInputProps {
    name?: string
    presetTags?: string[]
    selectedTags: string[]
    onTagsChange: (newTags: string[]) => void
    className?: string
    triggerclassName?: string
    selectedClassName?: string
    hasError?: boolean
    errorMessage?: string
    errorMessageClass?: string
}

export default function TagInput({ presetTags = [], selectedTags, onTagsChange, name = "tag", className, triggerclassName, selectedClassName, hasError, errorMessage, errorMessageClass }: TagInputProps) {
    const [open, setOpen] = useState(false)
    const [searchText, setSearchText] = useState("")
    const [optionsToDisplay, setOptionsToDisplay] = useState(presetTags)
    const [width, setWidth] = React.useState<string>("50%")
    const triggerRef = React.useRef<HTMLButtonElement | null>(null)

    useEffect(() => {
        if (triggerRef?.current) {
            setWidth(`${triggerRef.current.clientWidth}px`)
        }
    }, [])

    useEffect(() => {
        const filtered = presetTags.filter(tag =>
            tag.toLowerCase().includes(searchText.toLowerCase())
        )
        setOptionsToDisplay(filtered)
    }, [searchText, presetTags])

    const handleSelect = (currentValue: string) => {
        if (!selectedTags.includes(currentValue)) {
            onTagsChange([...selectedTags, currentValue])
        }
        else {
            onTagsChange(selectedTags.filter((t) => t !== currentValue))
        }
        // setSearchText("")
        // setOpen(false)
    }

    const handleRemove = (tag: string) => {
        onTagsChange(selectedTags.filter((t) => t !== tag))
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && searchText && !presetTags.includes(searchText)) {
            event.preventDefault()
            handleSelect(searchText)
        }
    }



    return (
        <div className={className}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild >
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn("w-full justify-between rounded-lg py-3.5 font-normal !text-muted-foreground focus-within:border-primary active:border-primary hover:border-primary transition-all", triggerclassName)}
                        ref={triggerRef}
                    >
                        Select or type {name}...
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 !bg-background text-foreground" style={{ width }}>
                    <div className="p-2">
                        <Input
                            className="w-full px-3 py-1.5 !border-input rounded text-sm !focus:border-primary"
                            placeholder="Search tags..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value.toLowerCase())}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                    {optionsToDisplay.length === 0 && (
                        <div className="p-2 py-4 text-sm text-center text-gray-500">
                            No tag found. Press enter to add &quot;{searchText}&quot; as a new {name}.
                        </div>
                    )}
                    <ul className={cn("flex items-center flex-wrap gap-1.5 max-h-60 overflow-y-auto p-4", optionsToDisplay.length == 0 && "hidden")}>
                        {
                            optionsToDisplay.map((tag) => (
                                <li
                                    key={tag}
                                    className={cn(
                                        "relative flex select-none items-center cursor-pointer rounded-full px-4 py-1.5 text-sm outline-none transition-colors hover:bg-primary/20 w-max",
                                        selectedTags.includes(tag) ? "!bg-primary !text-primary-foreground " : "bg-accent text-accent-foreground"
                                    )}
                                    onClick={() => handleSelect(tag)}
                                >
                                    {tag}
                                </li>
                            ))
                        }
                    </ul>
                </PopoverContent>
            </Popover>
            <div className={cn("flex flex-wrap gap-4 gap-y-5", optionsToDisplay.length > 0 && "my-2", selectedClassName)}>
                {
                    selectedTags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-sm cursor-pointer font-sans font-normal hover:bg-primary/20" onClick={() => handleRemove(tag)}>
                            {tag}
                            <button className="ml-1 hover:bg-muted rounded-full">
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))
                }
            </div>
            {
                hasError && <FormError className={errorMessageClass} errorMessage={errorMessage} />
            }
        </div>
    )
}
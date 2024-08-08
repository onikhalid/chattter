import React from 'react'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from './tooltip'
import { cn } from '@/utils/classNames'

interface ToolTipProps {
    content: string | React.ReactNode
    align?: "center" | "start" | "end"
    className?: string
    children: React.ReactNode
    contentClass?: string
    asChild?: boolean
}

const ToolTip: React.FC<ToolTipProps> = ({ content, children, className, align, contentClass, asChild=false }) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger className={className} asChild={asChild}>
                    {children}
                </TooltipTrigger>
                <TooltipContent align={align} className={cn(contentClass)}>
                    {content}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
export default ToolTip
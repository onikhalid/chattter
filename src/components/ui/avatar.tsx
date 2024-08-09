import React from "react";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "./avatarPrimitives"
import { cn } from "@/utils/classNames";
import { getInitials } from "@/utils/strings";


interface AvatarProps {
    src?: string | null;
    alt: string;
    fallback: string;
    fallbackClass?: string
    size?: "small" | "medium" | "large"

}
const AvatarComponent: React.FC<AvatarProps> = ({ src, alt, fallback, size = "medium", fallbackClass }) => {
    return (
        <Avatar className={cn(
            size === "small" && "w-7 h-7",
            size === "medium" && "w-9 h-9",
            size === "large" && "w-12 h-12",

        )}>
            {
                src &&
                <AvatarImage src={src} alt={alt || "avatar"} />
            }
            <AvatarFallback className={cn("bg-primary text-primary-foreground",
                size === "small" && "text-xs font-normal",
                size === "medium" && "text-sm",
                size === "large" && "text-[1.125rem]",
                fallbackClass
            )}>
                {getInitials(fallback || "")}

            </AvatarFallback>
        </Avatar>
    )
}
export default AvatarComponent
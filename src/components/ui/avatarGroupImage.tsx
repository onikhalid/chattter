import React from "react";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "./avatarPrimitives"


interface AvatarProps {
    src?: string | null;
    alt: string;
    fallback: string;
    size: "small" | "medium" | "large"

}
const AvatarComponent: React.FC<AvatarProps> = ({ src, alt, fallback }) => {
    return (
        <Avatar>
            <AvatarFallback className="max-md:bg-white max-md:text-primary" >{fallback}</AvatarFallback>
        </Avatar>
    )
}
export default AvatarComponent
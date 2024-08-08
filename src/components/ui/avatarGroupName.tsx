import React from "react";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "./avatarPrimitives"
import { getInitials } from "@/utils/strings";
import { cn } from "@/utils/classNames";
import ToolTip from "./tooltipCustom";


interface AvatarProps {
    names: string[]
    max?: number
    colorsArray?: string[]
    size: "small" | "medium" | "large"
}
const AvatarGroupName: React.FC<AvatarProps> = ({ names, max, colorsArray = ["#755AE2", "#3C1356", "#0E0E2C", "#073D9F"], size = "small" }) => {
    const getBgColor = (index: number) => {

        return `bg-[${colorsArray[index % colorsArray.length]}]`
    }

    return (
        <div className="relative flex group/container transition-all duration-300">
            {
                names?.slice(0, max || 5).map((name, index) => (

                    <ToolTip
                        key={index}
                        content={name}
                        contentClass="text-sm"
                        className={cn("relative",
                            size === "small" && index > 0 && '-ml-3',
                            size === "medium" && index > 0 && '-ml-4',
                            size === "large" && index > 0 && '-ml-6',
                            "transition-transform duration-300 hover-group/container:!ml-0"
                        )}
                    >

                        <Avatar className={cn(
                            size === "small" && "w-7 h-7",
                            size === "medium" && "w-9 h-9",
                            size === "large" && "w-12 h-12",

                        )}>
                            <AvatarFallback className={cn("max-md:bg-white max-md:text-primary",
                                getBgColor(index), index > 0 && "shadow-lg",
                                size === "small" && "text-xs font-normal",
                                size === "medium" && "text-sm",
                                size === "large" && "text-[14.5px]",

                            )} >
                                {getInitials(name || "")}
                            </AvatarFallback>
                        </Avatar>
                    </ToolTip>
                ))
            }
            {
                (max && names.length > max) || (!max && names.length > 5) &&
                <div className="relative -ml-4">
                    <Avatar>


                        <AvatarFallback className="max-md:bg-white max-md:text-primary" >
                            +{names.length - (max || 5)}
                        </AvatarFallback>
                    </Avatar>
                </div>
            }
            {/* {
                !max && names.length > 5 &&
                <div className="relative -ml-4">
                    <Avatar>

                        <AvatarFallback className="max-md:bg-white max-md:text-primary" >
                            +{names.length - 5}
                        </AvatarFallback>
                    </Avatar>
                </div>
            } */}
        </div>
    )
}
export default AvatarGroupName
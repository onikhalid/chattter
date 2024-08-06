'use client';

import * as React from 'react';
import { Command as CommandPrimitive } from 'cmdk';

import { cn } from '@/utils/classNames';
import { DialogProps } from '@radix-ui/react-dialog';

import { SearchIcon, SmallSpinner } from '../icons';
import { Dialog, DialogContent } from './dialog';



const Command = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
    <CommandPrimitive
        className={cn(
            'flex h-full w-full flex-col overflow-hidden rounded-md bg-white text-header-text',
            className
        )}
        ref={ref}
        {...props}
    />
));
Command.displayName = CommandPrimitive.displayName;

type CommandDialogProps = DialogProps;

const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
    return (
        <Dialog {...props}>
            <DialogContent className="overflow-hidden p-0 shadow-2xl">
                <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
                    {children}
                </Command>
            </DialogContent>
        </Dialog>
    );
};

type CommandInputProps = React.ComponentPropsWithoutRef<
    typeof CommandPrimitive.Input
> & {
    isLoading?: boolean;
};

const CommandInput = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Input>,
    CommandInputProps
>(({ className, isLoading = false, ...props }, ref) => (
    <div className={cn("flex items-center border-b border-primary-light px-3", className)}>
        <SearchIcon className="mr-2 h-5 w-5 shrink-0 opacity-50" fill="#292D32" />

        <CommandPrimitive.Input
            className={cn(
                'flex h-11 w-full rounded-md bg-transparent py-3 text-xs outline-none placeholder:text-helper-text disabled:cursor-not-allowed disabled:opacity-50',
                className
            )}
            ref={ref}
            {...props}
        />

        {isLoading && (
            <CommandPrimitive.Loading>
                <SmallSpinner color="#032282" />
            </CommandPrimitive.Loading>
        )}
    </div>
));

CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
    <CommandPrimitive.List
        className={cn('max-h-[300px] overflow-y-auto overflow-x-hidden', className)}
        ref={ref}
        {...props}
    />
));

CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Empty>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
    <CommandPrimitive.Empty
        className="py-6 text-center text-sm"
        ref={ref}
        {...props}
    />
));

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Group>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
    <CommandPrimitive.Group
        className={cn(
            'overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground',
            className
        )}
        ref={ref}
        {...props}
    />
));

CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Separator>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
    <CommandPrimitive.Separator
        className={cn('-mx-1 h-px bg-body-text', className)}
        ref={ref}
        {...props}
    />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
    <CommandPrimitive.Item
        className={cn(
            'relative flex cursor-default select-none items-center rounded-md px-2 py-1.5 text-sm outline-none aria-selected:bg-primary-light aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
            className
        )}
        ref={ref}
        {...props}
    />
));

CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
    return (
        <span
            className={cn(
                'ml-auto text-xs tracking-widest text-muted-foreground',
                className
            )}
            {...props}
        />
    );
};
CommandShortcut.displayName = 'CommandShortcut';

export {
    Command,
    CommandDialog,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandShortcut,
    CommandSeparator,
};

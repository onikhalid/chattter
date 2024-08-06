'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/utils/classNames';
import { buttonVariants } from './button';

const Dialog = DialogPrimitive.Root;

const DialogTrigger = ({
    className,
    variant,
    size,
    children,
    ...props
}: DialogPrimitive.DialogTriggerProps &
    VariantProps<typeof buttonVariants>) => {
    return (
        <DialogPrimitive.Trigger
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        >
            {children}
        </DialogPrimitive.Trigger>
    );
};
DialogTrigger.displayName = DialogPrimitive.Trigger.displayName;

const DialogClose = ({
    className,
    children,
    ...props
}: DialogPrimitive.DialogCloseProps & VariantProps<typeof buttonVariants>) => {
    return (
        <DialogPrimitive.Close
            className={cn(
                'bg-[#2D4696] px-6 py-2',
                buttonVariants({ variant: 'ghost', className })
            )}
            {...props}
        >
            {children}
        </DialogPrimitive.Close>
    );
};
DialogClose.displayName = DialogPrimitive.Close.displayName;

const DialogPortal = ({
    // className,
    children,
    ...props
}: DialogPrimitive.DialogPortalProps) => {
    return (
        <DialogPrimitive.Portal /*className={className}*/ {...props}>
            <div className="fixed inset-0 z-50 flex items-start justify-center sm:items-center">
                {children}
            </div>
        </DialogPrimitive.Portal>
    );
};
DialogPortal.displayName = DialogPrimitive.Portal.displayName;

// const DialogOverlay = React.forwardRef<
//     React.ElementRef<typeof DialogPrimitive.Overlay>,
//     React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
// >(({ className, ...props }, ref) => {
//     return (
//         <DialogPrimitive.Overlay
//             className={cn(
//                 'fixed inset-0 z-50 bg-black/80 backdrop-blur-md transition-all duration-100 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in',
//                 className
//             )}
//             {...props}
//             ref={ref}
//         />
//     );
// });
//CLAUDE.AI
const DialogOverlay = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => {
    return (
        <DialogPrimitive.Overlay
            className={cn(
                'fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/80 backdrop-blur-md transition-all duration-100 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in',
                className
            )}
            {...props}
            ref={ref}
        />
    );
});
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

interface CustomDialogContentProps {
    overlayClassName?: string;
}

// const DialogContent = React.forwardRef<
//     React.ElementRef<typeof DialogPrimitive.Content>,
//     React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> &
//     CustomDialogContentProps
// >(({ className, children, overlayClassName, ...props }, ref) => {
//     return (
//         <DialogPortal>
//             <DialogOverlay
//                 className={cn(
//                     'fixed inset-0 grid place-items-center sm:justify-center sm:overflow-y-auto',
//                     overlayClassName
//                 )}
//             >
//                 <DialogPrimitive.Content
//                     className={cn(
//                         'fixed bottom-0 z-50 h-max max-h-modal-content w-full gap-4  rounded-t-[2rem] bg-white animate-in data-[state=open]:fade-in-90 data-[state=open]:slide-in-from-bottom-10 sm:static sm:bottom-auto sm:my-[5vh] sm:max-h-none sm:max-w-[28rem] sm:overflow-visible sm:rounded-[1.35rem] sm:zoom-in-90 data-[state=open]:sm:slide-in-from-bottom-0 focus:outline-none',
//                         className
//                     )}
//                     ref={ref}
//                     {...props}
//                 >
//                     {children}
//                 </DialogPrimitive.Content>
//             </DialogOverlay>
//         </DialogPortal>
//     );
// });
// DialogContent.displayName = DialogPrimitive.Content.displayName;

// CLAUDE.AI
const DialogContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> &
    CustomDialogContentProps
>(({ className, children, overlayClassName, ...props }, ref) => {
    return (
        <DialogPortal>
            <DialogOverlay
                className={cn(
                    'fixed inset-0 grid place-items-center overflow-y-auto', 
                    overlayClassName
                )}
            >
                <DialogPrimitive.Content
                    className={cn(
                        // 'fixed bottom-0 z-50 h-max max-h-[calc(100vh-4rem)]w-full gap-4 rounded-t-[2rem] bg-white animate-in data-[state=open]:fade-in-90 data-[state=open]:slide-in-from-bottom-10 sm:static sm:bottom-auto sm:my-[5vh] sm:max-h-none sm:max-w-[28rem] sm:overflow-visible sm:rounded-[1.35rem] sm:zoom-in-90 data-[state=open]:sm:slide-in-from-bottom-0 focus:outline-none',

                        'fixed bottom-0 max-h-[calc(100vh-4rem)] w-full rounded-[1.35rem] bg-white animate-in data-[state=open]:fade-in-90 data-[state=open]:zoom-in-90 focus:outline-none sm:static sm:bottom-auto',
                        className
                    )}
                    ref={ref}
                    {...props}
                >
                    {children}
                </DialogPrimitive.Content>
            </DialogOverlay>
        </DialogPortal>
    );
});
DialogContent.displayName = DialogPrimitive.Content.displayName;



DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <div
            className={cn(
                'flex items-center justify-between gap-4 sm:rounded-t-[1.35rem] bg-primary px-6 md:px-8 pb-3 pt-[1.2rem] text-white',
                className
            )}
            {...props}
        />
    );
};
DialogHeader.displayName = 'DialogHeader';

// const DialogBody = ({
//     className,
//     ...props
// }: React.HTMLAttributes<HTMLDivElement>) => {
//     return (
//         <div
//             className={cn(
//                 'relative max-h-modal-body overflow-y-auto sm:max-h-none sm:overflow-y-visible',
//                 className
//             )}
//             {...props}
//         />
//     );
// };

//CLAUDE.AI
const DialogBody = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <div
            className={cn(
                'relative rounded-[1.25rem]',
                className
            )}
            {...props}
        />
    );
};
DialogBody.displayName = 'DialogBody';

const DialogFooter = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <div
            className={cn(
                'flex items-center sm:rounded-t-[1.35rem] md:rounded-[1.35rem]',
                className
            )}
            {...props}
        />
    );
};
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => {
    return (
        <DialogPrimitive.Title
            className={cn('text-base font-semibold', className)}
            ref={ref}
            {...props}
        />
    );
});
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => {
    return (
        <DialogPrimitive.Description
            className={cn('text-sm', className)}
            ref={ref}
            {...props}
        />
    );
});
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
    Dialog,
    DialogTrigger,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogBody,
    DialogFooter,
    DialogTitle,
    DialogDescription,
};

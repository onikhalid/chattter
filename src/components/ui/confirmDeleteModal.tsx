import React, { FC, ReactNode } from 'react';
import { Trash } from 'lucide-react';
import { cn } from '@/utils/classNames';

import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '.';
import { SmallSpinner } from '../icons';



interface Props {
    isModalOpen: boolean;
    closeModal: () => void
    deleteFunction: () => void
    isDeletePending?: boolean
    children: ReactNode
    title: string;
}

const ConfirmDeleteModal: FC<Props> = ({ isModalOpen, deleteFunction, closeModal, children, title, isDeletePending }) => {

    return (
        <Dialog modal={true} open={isModalOpen} >

            <DialogContent
                aria-label={title}
                className={cn(
                    'rounded-[10px]',
                    'my-6 '
                )}
                style={{
                    width: '92.5%',
                    minWidth: '300px',
                }}
                onPointerDownOutside={closeModal}
            >
                <DialogHeader className={cn('max-sm:sticky top-0 z-10 ')}>
                    {/* <h5 className='text-base font-medium '>Confirm Delete</h5> */}
                    <DialogTitle>{title}</DialogTitle>
                   </DialogHeader>
                
                <div className={cn('')}>
                    <div className='px-2'>
                        <span className='bg rounded-full p-2 inline-block'>
                            <Trash height={45} className='stroke-foreground' strokeWidth={2} width={45} />
                        </span>

                        <h3 className='!text-red-300 text-xl md:text-2xl font-medium mt-1 font-display'>{title}</h3>
                        {children}
                    </div>
                </div>


                <DialogFooter className='flex items-center justify-end gap-2.5 w-full rounded-2xl p-5'>
                    <Button className='py-2 px-6' variant="secondary" onClick={closeModal}>
                        Cancel
                    </Button>
                    <Button className='py-2 px-6' variant={'destructive'} onClick={deleteFunction}>
                        Delete
                        {isDeletePending && <span className='ml-2'><SmallSpinner className='text-primary'/></span>}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmDeleteModal;

import React, { useState, ReactNode } from 'react';
import { Dialog, DialogContent } from '.';
import toast from 'react-hot-toast';
import { Spinner } from '../icons';

interface LoadingModalProps {
  isModalOpen: boolean;
  children?: ReactNode;
  loadingMsg?:string
  errorMsg?: string;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ isModalOpen, errorMsg, loadingMsg }) => {
  return (
    // <Dialog open={isOpen} onPointerDownOutside={} className="relative z-[20000050]">
    <Dialog modal={true} open={isModalOpen} >
      <DialogContent
        aria-label={"loading modal"}
        onPointerDownOutside={() => toast.error(errorMsg || "Please wait for action to finish", { position: 'top-center' })}
        className='!bg-transparent'
      >
        <div className="flex flex-col items-center justify-center">
          <Spinner color='white' />
          <p className="ml-2 text-sm font-medium text-white">{loadingMsg || 'Loading...'}</p>
        </div>

      </DialogContent>
      {/* <div className="fixed inset-0 bg-black/60 backdrop-blur-lg" aria-hidden="true" />
      <div className="fixed inset-0 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <Dialog.Panel className="mx-auto w-screen">
            <Spinner />
          </Dialog.Panel>
        </div>
      </div> */}
    </Dialog>
  );
};

export default LoadingModal;
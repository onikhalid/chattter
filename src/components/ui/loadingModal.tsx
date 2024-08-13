
import React, { useState, ReactNode } from 'react';
import { Dialog, DialogContent } from '.';
import toast from 'react-hot-toast';
import { Spinner } from '../icons';

interface LoadingModalProps {
  isModalOpen: boolean;
  children?: ReactNode;
  loadingMsg?: string
  errorMsg?: string;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ isModalOpen, errorMsg, loadingMsg }) => {
  return (
    <Dialog modal={true} open={isModalOpen} >
      <DialogContent
        aria-label={"loading modal"}
        onPointerDownOutside={() => toast(errorMsg || "Please wait for action to finish", { position: 'top-center' })}
        className='!bg-transparent border-none shadow-none'
        showCloseButton={false}
      >
        <div className="flex flex-col items-center justify-center">
          <Spinner color='white' />
          <p className="ml-2 text-sm font-medium text-white">{loadingMsg || 'Loading...'}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoadingModal;
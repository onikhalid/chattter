import React from 'react';

import useBooleanStateControl from './useBooleanStateControl';

export default function useErrorModalState(initialState = false) {
  const {
    state: isErrorModalOpen,
    setState: setErrorModalState,
    setFalse: closeErrorModal,
    setTrue: openErrorModal,
  } = useBooleanStateControl(initialState);

  const [errorModalMessage, setErrorModalMessage] = React.useState('');

  const openErrorModalWithMessage = React.useCallback(
    (message: string) => {
      setErrorModalMessage(message);
      openErrorModal();
    },
    [openErrorModal]
  );

  return {
    isErrorModalOpen,
    setErrorModalState,
    closeErrorModal,
    openErrorModal,
    errorModalMessage,
    setErrorModalMessage,
    openErrorModalWithMessage,
  };
}

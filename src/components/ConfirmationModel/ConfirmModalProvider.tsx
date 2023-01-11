/**
 * @format
 */
import React, {useMemo, useState} from 'react';
import {Text} from 'native-base';

import {ConfirmModalContext} from './ConfirmModalContext';
import {CustomConfirmModal} from './CustomConfirmModal';

export type VariantTypes = 'success' | 'warning' | 'error';

export type ShowParams = {
  message?: JSX.Element | undefined;
  title?: JSX.Element | undefined;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
};

interface ProviderState extends ShowParams {
  open: boolean;
}

export interface ConfirmModalContextType {
  show: (params: ShowParams) => void;
}

const DEFAULT_STATE = {
  open: false,
  message: <Text>Message</Text>,
  title: <Text>Title</Text>,
  submitLabel: 'Confirm',
  cancelLabel: 'Cancel',
};

function ConfirmModalProvider({children}: {children: React.ReactNode}) {
  const [state, setState] = useState<ProviderState>({
    ...DEFAULT_STATE,
  });

  const show = React.useCallback((params: ShowParams) => {
    setState(() => ({...DEFAULT_STATE, ...params, open: true}));
  }, []);

  const handleCancel = () => {
    const {onCancel} = state;
    setState(v => ({...v, open: false}));
    onCancel?.();
  };
  const handleConfirm = () => {
    const {onConfirm} = state;
    setState(v => ({...v, open: false}));
    onConfirm?.();
  };

  const handleClose = () => {
    setState(v => ({...v, open: false}));
  };

  const context = useMemo(() => ({show}), [show]);

  return (
    <>
      <ConfirmModalContext.Provider value={context}>
        {children}
      </ConfirmModalContext.Provider>
      <CustomConfirmModal
        cancelLabel={state.cancelLabel || ''}
        handleCancel={handleCancel}
        handleClose={handleClose}
        handleConfirm={handleConfirm}
        message={state.message || undefined}
        open={state.open}
        submitLabel={state.submitLabel || ''}
        title={state.title || undefined}
      />
    </>
  );
}

export {ConfirmModalProvider};

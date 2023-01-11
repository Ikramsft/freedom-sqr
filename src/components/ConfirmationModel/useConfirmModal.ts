/**
 * @format
 */
import React from 'react';
import {ConfirmModalContext} from './ConfirmModalContext';

function useConfirmModal() {
  return React.useContext(ConfirmModalContext);
}

export {useConfirmModal};

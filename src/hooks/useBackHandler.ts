/**
 * @format
 */
import React from 'react';
import {BackHandler} from 'react-native';

type HandlerType = () => boolean | null | undefined;

export const useBackHandler = (handler: HandlerType) => {
  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handler);
    return () => BackHandler.removeEventListener('hardwareBackPress', handler);
  }, [handler]);
};

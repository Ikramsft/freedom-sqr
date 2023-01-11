/**
 * @format
 */
import React from 'react';
import {View} from 'native-base';
import {IViewProps} from 'native-base/lib/typescript/components/basic/View/types';

export function Container(props: IViewProps) {
  const {children, ...rest} = props;
  return (
    <View alignItems="center" flexDir="row" {...rest}>
      {children}
    </View>
  );
}

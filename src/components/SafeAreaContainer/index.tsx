/**
 * @format
 */
import React from 'react';
import {StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {SafeAreaView, SafeAreaViewProps} from 'react-native-safe-area-context';

import {useAppTheme} from '../../theme/useTheme';

interface SafeAreaProps extends SafeAreaViewProps {
  children: JSX.Element | JSX.Element[];
  style?: StyleProp<ViewStyle>;
}

function SafeAreaContainer(props: SafeAreaProps) {
  const {children, style, ...rest} = props;
  const {colors} = useAppTheme();
  return (
    <SafeAreaView
      edges={['bottom']}
      {...rest}
      style={[
        styles.safeAreaView,
        {backgroundColor: colors.white[700]},
        style,
      ]}>
      {children}
    </SafeAreaView>
  );
}

SafeAreaContainer.defaultProps = {
  style: undefined,
};

const styles = StyleSheet.create({
  safeAreaView: {
    flexGrow: 1,
  },
});

export {SafeAreaContainer};

/**
 * @format
 */
import {Text, Button as NativeButton, IButtonProps} from 'native-base';
import {
  ColorType,
  ResponsiveValue,
} from 'native-base/lib/typescript/components/types';
import {
  IFontSize,
  IFontWeight,
} from 'native-base/lib/typescript/theme/base/typography';
import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {useAppTheme} from '../../theme/useTheme';

export interface ButtonProps extends IButtonProps {
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  style?: StyleProp<ViewStyle>;
  title: string | JSX.Element;
  onPress?: () => void;
  fontWeight?: ResponsiveValue<IFontWeight | number | (string & unknown)>;
  fontSize?: ResponsiveValue<IFontSize | number | (string & unknown)>;
  textColor?: ColorType;
}

function Button(props: ButtonProps) {
  const {
    loading,
    disabled,
    loadingText,
    title,
    style,
    onPress,
    fontWeight,
    fontSize,
    textColor,
    ...rest
  } = props;

  const theme = useAppTheme();

  return (
    <NativeButton
      _loading={{_text: {color: theme.colors.white[900]}}}
      borderRadius={5}
      colorScheme={disabled ? 'gray' : 'brand'}
      isDisabled={disabled}
      isLoading={loading}
      isLoadingText={loadingText}
      style={style}
      onPress={onPress}
      {...rest}>
      <Text
        color={textColor ?? theme.colors.white[900]}
        fontSize={fontSize}
        fontWeight={fontWeight}>
        {title}
      </Text>
    </NativeButton>
  );
}

Button.defaultProps = {
  disabled: false,
  loading: false,
  loadingText: '',
  style: undefined,
  onPress: undefined,
  fontWeight: 'bold',
  fontSize: 15,
  textColor: '#fff',
};

export {Button};

import {
  Box,
  FormControl,
  IInputProps,
  Input,
  Text,
  View,
  WarningOutlineIcon,
} from 'native-base';
import React from 'react';
import {StyleSheet, TextInput, TextStyle, ViewStyle} from 'react-native';

import {useAppTheme} from '../../theme/useTheme';
import {SubTitle, Title} from '../Typography';

interface IRenderInputProps extends IInputProps {
  label?: string;
  error?: string;
  labelStyles?: TextStyle;
  showCount?: boolean;
  containerStyles?: ViewStyle;
  editable?: boolean;
}

const TextFieldView = React.forwardRef<TextInput, IRenderInputProps>(
  (props: IRenderInputProps, ref) => {
    const {
      showCount,
      error,
      label,
      labelStyles,
      containerStyles,
      style,
      ...restProps
    } = props;

    const theme = useAppTheme();

    return (
      <Box alignItems="center" style={containerStyles}>
        <FormControl isInvalid={Boolean(error)}>
          {label ? (
            <Title
              color={theme.colors.black[700]}
              fontWeight="500"
              mb={2}
              mt={2}
              style={labelStyles}>
              {label}
            </Title>
          ) : null}
          <Input
            backgroundColor={
              !props.editable
                ? `${theme.colors.white[900]}20`
                : theme.colors.white[900]
            }
            borderRadius={5}
            fontSize="sm"
            minHeight={props.minHeight ?? props.multiline ? '100px' : '48px'}
            placeholderTextColor={theme.colors.black[500]}
            ref={ref}
            size="md"
            style={[styles.input, style]}
            {...restProps}
          />
          {showCount ? (
            <SubTitle
              color={theme.colors.gray[500]}
              fontSize="xs"
              position="absolute"
              right={1}
              top={label ? '12px' : '-12px'}>
              {props.value?.length}/{props.maxLength}
            </SubTitle>
          ) : null}
          {error ? (
            <View flexDirection="row" mt={2} pr={2} width="100%">
              <WarningOutlineIcon
                size="xs"
                style={[{color: theme.colors.red[600]}, styles.errorIconStyle]}
              />
              <Text color={theme.colors.red[600]} width="98%">
                {error}
              </Text>
            </View>
          ) : null}
        </FormControl>
      </Box>
    );
  },
);

TextFieldView.defaultProps = {
  label: undefined,
  error: undefined,
  labelStyles: {},
  containerStyles: {},
  showCount: false,
  editable: true,
};

const styles = StyleSheet.create({
  input: {
    minHeight: 48,
    borderWidth: 0,
  },
  errorIconStyle: {
    marginTop: 5,
    marginRight: 5,
  },
});

const TextField = React.memo(TextFieldView);
export {TextField};

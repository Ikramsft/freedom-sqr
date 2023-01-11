/**
 * @format
 */
import React from 'react';
import {VStack, Select, ISelectProps, Box} from 'native-base';
import {TextStyle} from 'react-native';
import {Title} from '../Typography';
import {useAppTheme} from '../../theme/useTheme';

type Option = {
  label: string;
  value: string;
  disabled?: boolean;
};

interface Props extends ISelectProps {
  error: string | undefined;
  value: string | undefined;
  list: Option[];
  labelStyles?: TextStyle;
  valueStyle?: TextStyle;
  onBlur?: () => void;
}

function Dropdown(props: Props) {
  const theme = useAppTheme();

  const {placeholder, value, list, labelStyles, valueStyle, onBlur, ...rest} =
    props;

  return (
    <VStack>
      {placeholder ? (
        <Title
          color={theme.colors.black[700]}
          fontWeight="500"
          mb={2}
          mt={2}
          style={labelStyles}>
          {placeholder}
        </Title>
      ) : null}
      <Box backgroundColor={theme.colors.white[900]}>
        <Select
          fontSize="sm"
          height="50px"
          placeholder={placeholder}
          selectedValue={value}
          style={valueStyle}
          onClose={onBlur}
          {...rest}>
          {list.map(l => (
            <Select.Item
              disabled={l.disabled}
              key={l.label}
              label={l.label}
              value={l.value}
            />
          ))}
        </Select>
      </Box>
    </VStack>
  );
}

Dropdown.defaultProps = {
  labelStyles: undefined,
  valueStyle: undefined,
  onBlur: undefined,
};

export {Dropdown};

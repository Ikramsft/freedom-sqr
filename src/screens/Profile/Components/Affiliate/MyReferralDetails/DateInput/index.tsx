/**
 * @format
 */
import React from 'react';
import {View} from 'native-base';
import Entypo from 'react-native-vector-icons/Entypo';
import DatePicker, {DatePickerProps} from 'react-native-date-picker';

import {AppTheme} from 'theme';
import {SafeTouchable, SubTitle} from 'components';

interface Props extends Omit<DatePickerProps, 'theme'> {
  theme: AppTheme;
  title: string;
  onPress: () => void;
  value?: string;
}

function DateInput(props: Props) {
  const {theme, title, value, onPress, ...rest} = props;

  return (
    <View
      borderColor={theme.colors.black[200]}
      borderRadius={4}
      borderWidth={0.5}
      height="40px"
      justifyContent="center"
      px={2}>
      <SafeTouchable onPress={onPress}>
        <View
          alignItems="center"
          flexDirection="row"
          justifyContent="space-between">
          <View>
            <View flexDirection="row">
              <SubTitle fontSize="sm">{title}</SubTitle>
              <SubTitle fontSize="sm" ml={1}>
                *
              </SubTitle>
            </View>
            {value ? (
              <SubTitle color={theme.colors.black[600]} fontSize={13}>
                {value}
              </SubTitle>
            ) : null}
          </View>
          <Entypo color={theme.colors.black[800]} name="calendar" size={20} />
        </View>
      </SafeTouchable>
      <DatePicker modal {...rest} />
    </View>
  );
}

DateInput.defaultProps = {
  value: undefined,
};

export {DateInput};

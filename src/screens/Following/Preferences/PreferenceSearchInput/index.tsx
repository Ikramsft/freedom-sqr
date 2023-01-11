/**
 * @format
 */
import React from 'react';
import {CloseIcon, IInputProps, View} from 'native-base';

import {SafeTouchable, TextField} from 'components';
import {useAppTheme} from 'theme';

import {SearchIcon} from '../../../../assets/svg';

interface Props extends IInputProps {
  showClear: boolean;
  onClearPress?: () => void;
}

function PreferenceSearchInput(props: Props) {
  const {showClear, onClearPress, ...rest} = props;
  const {colors} = useAppTheme();

  return (
    <View mb={1} px={2}>
      <TextField
        borderColor={colors.black[700]}
        borderStyle="solid"
        borderWidth={0.25}
        fontSize="xs"
        leftElement={
          <View pl={3}>
            <SearchIcon />
          </View>
        }
        placeholder="Search"
        placeholderTextColor={colors.black[700]}
        rightElement={
          showClear ? (
            <View pr={3}>
              <SafeTouchable onPress={onClearPress}>
                <CloseIcon />
              </SafeTouchable>
            </View>
          ) : undefined
        }
        size="xl"
        variant="rounded"
        {...rest}
      />
    </View>
  );
}

PreferenceSearchInput.defaultProps = {
  onClearPress: undefined,
};

export {PreferenceSearchInput};

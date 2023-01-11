/**
 * @format
 */
import React from 'react';
import {View} from 'native-base';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import {SafeTouchable} from 'components';

import {IPickerProps} from './index';

interface ITrashProps extends IPickerProps {
  onPress?: () => void;
  disabled: boolean;
}

export function EditIcon(props: ITrashProps) {
  const {theme, disabled, onPress} = props;
  const {colors} = theme;

  return (
    <View
      alignItems="center"
      backgroundColor={colors.black[500]}
      borderBottomLeftRadius={6}
      height="25px"
      justifyContent="center"
      position="absolute"
      right={0}
      top={0}
      width="25px"
      zIndex={9999}>
      <SafeTouchable activeOpacity={0.9} disabled={disabled} onPress={onPress}>
        <MaterialIcon color={colors.white[900]} name="edit" size={15} />
      </SafeTouchable>
    </View>
  );
}

EditIcon.defaultProps = {
  onPress: undefined,
};

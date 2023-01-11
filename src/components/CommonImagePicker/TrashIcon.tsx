/**
 * @format
 */
import React from 'react';
import {Spinner, View} from 'native-base';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import {SafeTouchable} from 'components';

import {IPickerProps} from './index';

interface ITrashProps extends IPickerProps {
  onPress?: () => void;
  deleting: boolean;
}

export function TrashIcon(props: ITrashProps) {
  const {theme, deleting, onPress} = props;
  const {colors} = theme;

  return (
    <View
      alignItems="center"
      backgroundColor={deleting ? colors.white[900] : colors.danger[500]}
      borderTopLeftRadius={6}
      bottom={0}
      height="25px"
      justifyContent="center"
      position="absolute"
      right={0}
      width="25px"
      zIndex={9999}>
      {deleting ? (
        <Spinner />
      ) : (
        <SafeTouchable activeOpacity={0.9} onPress={onPress}>
          <MaterialIcon color={colors.white[900]} name="delete" size={15} />
        </SafeTouchable>
      )}
    </View>
  );
}

TrashIcon.defaultProps = {
  onPress: undefined,
};

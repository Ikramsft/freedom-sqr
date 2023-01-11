/**
 * @format
 */
import React from 'react';
import {View} from 'native-base';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import {SubTitle} from '../Typography';
import {IPickerProps} from './index';

interface ITrashProps extends IPickerProps {
  renderSelectionUI?: JSX.Element | undefined;
  subTitle?: string;
  iconSize?: number;
}

export function SelectionUI(props: ITrashProps) {
  const {subTitle, renderSelectionUI, iconSize, theme} = props;
  const {colors} = theme;
  return (
    renderSelectionUI ?? (
      <View
        alignItems="center"
        backgroundColor={colors.gray[500]}
        borderRadius={5}
        borderWidth={1}
        flex={1}
        justifyContent="center"
        width="100%">
        <MaterialIcon name="add" size={iconSize} />
        {subTitle ? <SubTitle>{subTitle}</SubTitle> : null}
      </View>
    )
  );
}

SelectionUI.defaultProps = {
  renderSelectionUI: undefined,
  subTitle: undefined,
  iconSize: 75,
};

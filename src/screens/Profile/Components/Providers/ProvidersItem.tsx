/**
 * @format
 */
import React from 'react';
import {View, Text} from 'native-base';

import {Checkbox} from 'components';

import {IProvider} from '../../../../redux/user/userInterface';

interface Props {
  item: IProvider;
  isChecked: boolean;
  onToggle?: (item: IProvider, isSelected: boolean) => void;
}

function ProviderItem(props: Props) {
  const {item, isChecked, onToggle} = props;
  const {documentID, name} = item;

  const onChange = (isSelected: boolean) => onToggle?.(item, isSelected);

  return (
    <View mt={2}>
      <Checkbox isChecked={isChecked} value={documentID} onChange={onChange}>
        <Text>{name}</Text>
      </Checkbox>
    </View>
  );
}

ProviderItem.defaultProps = {
  onToggle: undefined,
};

export {ProviderItem};

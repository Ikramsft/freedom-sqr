/**
 * @format
 */
import React from 'react';
import {View, Text} from 'native-base';

import {Checkbox} from 'components';

import {ILocation} from '../../../../redux/user/userInterface';

interface Props {
  item: ILocation;
  isChecked: boolean;
  onToggle?: (item: ILocation, isSelected: boolean) => void;
}

function LocationItem(props: Props) {
  const {item, isChecked, onToggle} = props;
  const {documentId, name} = item;

  const onChange = (isSelected: boolean) => onToggle?.(item, isSelected);

  return (
    <View mt={2}>
      <Checkbox isChecked={isChecked} value={documentId} onChange={onChange}>
        <Text>{name}</Text>
      </Checkbox>
    </View>
  );
}

LocationItem.defaultProps = {
  onToggle: undefined,
};

export {LocationItem};

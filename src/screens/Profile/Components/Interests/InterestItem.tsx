/**
 * @format
 */
import React from 'react';
import {View, Text} from 'native-base';

import {Checkbox} from 'components';

import {IInterest} from '../../../../redux/user/userInterface';

interface Props {
  item: IInterest;
  isChecked: boolean;
  onToggle?: (item: IInterest, isSelected: boolean) => void;
}

function InterestItem(props: Props) {
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

InterestItem.defaultProps = {
  onToggle: undefined,
};

export {InterestItem};

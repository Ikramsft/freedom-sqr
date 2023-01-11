/**
 * @format
 */
import React from 'react';
import {View, Text, useDisclose, Actionsheet, Spinner} from 'native-base';

import {AppTheme} from 'theme';
import {SafeTouchable} from 'components';

import {IAchDetails} from '../../ManageAchInfo/useAchForm';
import {EllipsisLargeIcon} from '../../../../../../assets/svg';

interface IAchInfoItemProps {
  theme: AppTheme;
  item: IAchDetails;
  removing: boolean;
  onEdit?: (item: IAchDetails) => void;
  onDelete?: (item: IAchDetails) => void;
}

export function AchInfoItem(props: IAchInfoItemProps) {
  const {theme, item, removing, onEdit, onDelete} = props;

  const {isOpen, onOpen, onClose} = useDisclose();

  const {documentId, name, accountNumber} = item;
  const key = `ach-info-item-${documentId}`;

  const onEditPress = () => {
    onClose();
    onEdit?.(item);
  };

  const onDeletePress = () => {
    onClose();
    onDelete?.(item);
  };

  return (
    <View borderRadius={5} borderWidth={1} key={key} mt={2}>
      <View flexDirection="row" flexGrow={1} justifyContent="space-between">
        <View ml={2} py={2}>
          <Text color={theme.colors.black[700]} ml={2}>
            {name}
          </Text>
          <Text color={theme.colors.black[700]} fontSize="12px" ml={2}>
            Account: {accountNumber}
          </Text>
        </View>
        <SafeTouchable disabled={removing} onPress={onOpen}>
          <View alignItems="center" height={10} pt={4} width={10}>
            {removing ? <Spinner /> : <EllipsisLargeIcon />}
          </View>
        </SafeTouchable>
      </View>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Actionsheet.Item key="EditCard" onPress={onEditPress}>
            Edit
          </Actionsheet.Item>
          <Actionsheet.Item key="DeleteCard" onPress={onDeletePress}>
            Delete
          </Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>
    </View>
  );
}

AchInfoItem.defaultProps = {
  onEdit: undefined,
  onDelete: undefined,
};

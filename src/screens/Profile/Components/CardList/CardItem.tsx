/**
 * @format
 */
import React from 'react';
import {View, Text, Spinner, useDisclose, Actionsheet} from 'native-base';

import {useAppTheme} from 'theme';
import {SafeTouchable} from 'components';

import {ICreditCard} from '../../../Payments/useCardForm';
import {insertAt} from '../../../../utils';
import {EllipsisLargeIcon} from '../../../../assets/svg';

interface ICardItemProps {
  item: ICreditCard;
  onEdit?: (item: ICreditCard) => void;
  removing?: boolean;
  onDelete?: (item: ICreditCard) => void;
}

export function CardItem(props: ICardItemProps) {
  const theme = useAppTheme();

  const {isOpen, onOpen, onClose} = useDisclose();

  const {item, removing, onEdit, onDelete} = props;
  const {aliasName, expirationDate, lastNumbers, isDefault} = item;
  const key = `card-item-${item.documentId}`;

  const onEditPress = () => {
    onClose();
    onEdit?.(item);
  };

  const onDeletePress = () => {
    onClose();
    onDelete?.(item);
  };

  return (
    <View
      borderColor={
        isDefault ? theme.colors.brand[600] : theme.colors.black[700]
      }
      borderRadius={5}
      borderWidth={isDefault ? 2 : 1}
      key={key}
      mt={2}>
      <View flexDirection="row" flexGrow={1} justifyContent="space-between">
        <View ml={2} py={2}>
          <View flexDirection="row" flexGrow={1} justifyContent="space-between">
            <Text color={theme.colors.black[700]} ml={2}>
              {aliasName} ****{lastNumbers}
            </Text>
            {isDefault ? (
              <View
                borderColor={theme.colors.brand[600]}
                borderRadius={5}
                borderWidth={1}
                ml={4}
                px={2}>
                <Text>Default</Text>
              </View>
            ) : null}
          </View>
          <Text color={theme.colors.black[700]} fontSize="12px" ml={2}>
            Expiration {insertAt(expirationDate, 2, '/')}
          </Text>
        </View>
        {removing ? (
          <View mr={3} mt={2}>
            <Spinner pl={2} />
          </View>
        ) : (
          <View height="30px" mt={2} pt={1} width="30px">
            <SafeTouchable onPress={onOpen}>
              <EllipsisLargeIcon />
            </SafeTouchable>
          </View>
        )}
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

CardItem.defaultProps = {
  onEdit: undefined,
  onDelete: undefined,
  removing: false,
};

/**
 * @format
 */
import React from 'react';
import {Spinner, View, Text} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {useAppTheme} from 'theme';
import {
  ScrollView,
  SafeTouchable,
  SafeAreaContainer,
  Title,
  SubTitle,
  useConfirmModal,
} from 'components';

import {RootStackParamList} from '../../../../navigation';
import {useCardList} from './useCardList';
import {CardItem} from './CardItem';
import {ICreditCard} from '../../../Payments/useCardForm';
import {useCardOperations} from '../../../Payments/useCardOperations';
import {FormType} from '../../../../constants';

function CardList() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const theme = useAppTheme();

  const {isLoading, data = []} = useCardList();

  const {removing, removeCard} = useCardOperations();

  const confirm = useConfirmModal();

  const addPayment = () =>
    navigation.push('ManagePayment', {
      formType: FormType.ADD,
      totalCards: 0,
    });

  const onDelete = (item: ICreditCard) => {
    confirm?.show?.({
      title: <SubTitle fontSize={18}>Delete Card</SubTitle>,
      message: (
        <Text>
          <Text>Are you sure you want to Delete Card?</Text>
        </Text>
      ),
      onConfirm: () => {
        removeCard(item.documentId);
      },
      submitLabel: 'YES',
      cancelLabel: 'CANCEL',
    });
  };

  const onEdit = (item: ICreditCard) =>
    navigation.push('ManagePayment', {
      formType: FormType.EDIT,
      savedCardValues: item,
      totalCards: data.length,
    });

  return (
    <SafeAreaContainer>
      <ScrollView>
        <View mt={2} px={4}>
          <Title fontSize="md">Payment methods</Title>
          <Text color={theme.colors.black[700]} my={2}>
            Add and manage your payment methods.
          </Text>
          {isLoading ? (
            <Spinner />
          ) : data.length ? (
            data.map((card, index) => {
              const key = `card-${index}-${card.documentId}`;
              return (
                <CardItem
                  item={card}
                  key={key}
                  removing={
                    removing.removing && card.documentId === removing.removingId
                  }
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              );
            })
          ) : (
            <SubTitle>No Payment Method Found</SubTitle>
          )}
          <View alignItems="flex-start" mt={4}>
            <SafeTouchable onPress={addPayment}>
              <View
                borderBottomColor={theme.colors.maroon[900]}
                borderBottomWidth={1}>
                <Text color={theme.colors.maroon[900]} fontSize="14px">
                  Add other payment method
                </Text>
              </View>
            </SafeTouchable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaContainer>
  );
}

export {CardList};

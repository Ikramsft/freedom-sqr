/**
 * @format
 */
import React from 'react';
import {View, Text, Spinner, Divider} from 'native-base';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppTheme} from 'theme';
import {Button, Title, SubTitle, useConfirmModal} from 'components';

import {useAchPaymentList} from './useAchPaymentList';
import {IAchDetails} from '../ManageAchInfo/useAchForm';
import {AchInfoItem} from './AchInfoItem';
import {RootStackParamList} from '../../../../../navigation';
import {useDeleteAchInfo} from './useDeleteAchInfo';

interface Props {
  theme: AppTheme;
  onJoin: () => void;
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

function AffiliateInfo(props: Props) {
  const {navigation, theme, onJoin} = props;

  const {data = [], isLoading} = useAchPaymentList();

  const {
    isLoading: isRemoving,
    variables,
    tryDeleteAchInfo,
  } = useDeleteAchInfo();

  const confirm = useConfirmModal();

  if (isLoading) {
    return (
      <View>
        <Title>Freedom Square Affiliate Program</Title>
        <Spinner />
      </View>
    );
  }

  if (data.length > 0) {
    const onEdit = (item: IAchDetails) =>
      navigation.navigate('ManageAchInfo', {info: item});

    const onDelete = (item: IAchDetails) => {
      confirm?.show?.({
        title: <SubTitle fontSize={18}>Delete ACH Info</SubTitle>,
        message: (
          <Text>
            Are you sure you want to delete your information? We will not be
            able to compensate you for participating in the Affiliate Program.
          </Text>
        ),
        onConfirm: () => tryDeleteAchInfo(item),
        submitLabel: 'YES',
        cancelLabel: 'CANCEL',
      });
    };

    return (
      <View mt={3}>
        <Title>Freedom Square Affiliate Program</Title>
        <Text mt={1}>
          Share your link with other freedom loving and supporting Businesses.
          Help grow the community and promote liberty.
        </Text>
        <Divider borderStyle="dashed" borderWidth={0.5} mt={4} />
        {data.map(d => {
          const key = `ach-info-key-${d.documentId}`;
          const removing = isRemoving && variables?.documentId === d.documentId;
          return (
            <AchInfoItem
              item={d}
              key={key}
              removing={removing}
              theme={theme}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          );
        })}
      </View>
    );
  }

  return (
    <View
      borderColor="rgb(29, 29, 29)"
      borderRadius={4}
      borderWidth={0.25}
      mb={3}
      mt={3}
      p={4}>
      <Title fontSize={18} fontWeight="normal" mb={1}>
        Join our Freedom Square Affiliate Program
      </Title>
      <Text mt={1}>
        Share your link with other freedom loving and supporting Businesses.
        Help grow the community and promote liberty. It's quick and easy to
        start.
      </Text>
      <Text mt={1}>Fill out the Direct Deposit Form.</Text>
      <Text mt={1}>
        Earn a #$ commission for every valid Business that joins.
      </Text>
      <Text mt={1}>Cash in!</Text>
      <Button mt={4} title="Join" onPress={onJoin} />
    </View>
  );
}

export {AffiliateInfo};

/**
 * @format
 */
import React from 'react';
import {Image, View} from 'native-base';

import {SafeTouchable, Title, SubTitle} from 'components';

import {getNewsProviderLogo, timeDiffCalc} from '../../../utils';
import {INewsProvider} from '../../News/Queries/useNewsFeed';
import {navigate} from '../../../navigation/navigationRef';

interface IProviderInfoProps {
  provider: INewsProvider;
  contentType?: string;
  date: string;
}

export function ProviderInfo(props: IProviderInfoProps) {
  const {provider, contentType, date} = props;

  const onNamePress = () => {
    navigate('NewsProviderWall', {
      provider: {
        postProvider: provider?.name,
        postProviderId: provider?.documentID,
        postProviderLogo: provider?.logo,
        providerUrl: provider?.url,
      },
    });
  };

  const uri = getNewsProviderLogo(contentType || '', provider?.name);

  return (
    <View mt={4} px={5}>
      <View flexDirection="row">
        <Image alt="provider-logo" height={6} source={uri} width={6} />
        <View ml={2}>
          <SafeTouchable onPress={onNamePress}>
            <Title>{provider?.name}</Title>
          </SafeTouchable>
          <View alignItems="center" flexDirection="row">
            {contentType && (
              <>
                <Title>{contentType}</Title>
                <View
                  backgroundColor="black.900"
                  mx={2}
                  rounded="full"
                  size={1}
                />
              </>
            )}
            <SubTitle fontSize="xs">{timeDiffCalc(date)}</SubTitle>
          </View>
        </View>
      </View>
    </View>
  );
}

ProviderInfo.defaultProps = {
  contentType: undefined,
};

/**
 * @format
 */
import React from 'react';
import {View} from 'native-base';

import {RootStackScreenProps} from 'navigation/DrawerNav';
import {Header, SafeAreaContainer, Title} from 'components';

function WhoToFollow(props: RootStackScreenProps<'WhoToFollow'>) {
  return (
    <SafeAreaContainer edges={['top', 'bottom']}>
      <Header />
      <View flex={1}>
        <Title>Coming Soon</Title>
      </View>
    </SafeAreaContainer>
  );
}

export default WhoToFollow;

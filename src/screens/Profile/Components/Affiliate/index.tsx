/**
 * @format
 */
import * as React from 'react';
import {View, Spinner} from 'native-base';
import Clipboard from '@react-native-clipboard/clipboard';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

import {useAppTheme} from 'theme';
import {Button, ScrollView, SafeAreaContainer, Title} from 'components';

import {useAffiliateLink} from './useAffiliateLink';
import {showSnackbar} from '../../../../utils/SnackBar';
import {AffiliateInfo} from './AffiliateInfo';
import {MyReferralDetails} from './MyReferralDetails';
import {RootStackParamList} from '../../../../navigation';

function Affiliate() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {data = '', isLoading} = useAffiliateLink();

  const theme = useAppTheme();

  const onCopyLinkPress = () => {
    Clipboard.setString(data);
    showSnackbar({message: 'Link Copied', type: 'success'});
  };

  const onJoinPress = () => navigation.navigate('ManageAchInfo');

  return (
    <SafeAreaContainer>
      <ScrollView>
        <View px={3}>
          <View pt={2}>
            <View mb={2} mt={3}>
              <View>
                <Title alignSelf="center">My Affiliate Link</Title>
              </View>
            </View>
            {isLoading ? (
              <Spinner />
            ) : data ? (
              <View alignItems="center" mb={3}>
                <View
                  alignItems="center"
                  borderRadius={4}
                  borderWidth={1}
                  mt={2}
                  py={2}
                  width="100%">
                  <Title>{data}</Title>
                </View>
                <View mt={2} width="100%">
                  <Button title="Copy Link" onPress={onCopyLinkPress} />
                </View>
              </View>
            ) : null}
          </View>
          {/* <Divider mt={2} /> */}
          <MyReferralDetails theme={theme} />
          {/* <Divider my={3} /> */}
          <AffiliateInfo
            navigation={navigation}
            theme={theme}
            onJoin={onJoinPress}
          />
        </View>
      </ScrollView>
    </SafeAreaContainer>
  );
}

export {Affiliate};

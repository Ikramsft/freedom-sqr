/**
 * @format
 */
import React, {useMemo} from 'react';
import {View} from 'native-base';
import {ScrollView} from 'react-native-gesture-handler';
import {RootStackScreenProps} from 'navigation/DrawerNav';
import {Header, SafeAreaContainer} from 'components';
import DisplayAds from 'components/DisplayAds';
import {Alert, Linking} from 'react-native';
import {openInAppBrowser} from '../../utils';
import {useAds, useTrackAdv} from '../../hooks/useAds';
import AllBusiness from './AllBusiness';
import FeaturedBusiness from './FeaturedBusiness';
import RecentAdded from './RecentAdded';
import {IBusinessItem} from './Queries/useBusinessTab';

function BusinessTab(props: RootStackScreenProps<'BusinessTab'>) {
  const {navigation} = props;
  const {data} = useAds({page: 'businesses'});
  const {handleAdvTrack} = useTrackAdv();

  const onSelect = (item: IBusinessItem) =>
    navigation.navigate('BusinessDetail', {businessId: item.documentId});

  const filteredMA = useMemo(() => {
    return data?.filter(x => x.position === 'MA') || [];
  }, [data]);

  const handleClickAdv = async (url: string, adId: string) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        openInAppBrowser(url);
        handleAdvTrack({adId, event: 'click'});
      } else {
        Alert.alert('err');
      }
    });
  };

  const handleOnImpression = (adId: string) => {
    try {
      handleAdvTrack({adId, event: 'impression'});
    } catch (error) {
      console.log('err', error);
    }
  };

  return (
    <SafeAreaContainer edges={['top', 'bottom']}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false}>
        <DisplayAds
          adIndex={5}
          dataList={filteredMA}
          handleOnImpression={handleOnImpression}
          onPress={handleClickAdv}
        />
        <View pb={20} px={3.5}>
          <FeaturedBusiness navigation={navigation} onSelect={onSelect} />
          <RecentAdded navigation={navigation} onSelect={onSelect} />
          <AllBusiness navigation={navigation} onSelect={onSelect} />
        </View>
      </ScrollView>
    </SafeAreaContainer>
  );
}

export default BusinessTab;

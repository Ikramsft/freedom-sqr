/**
 * @format
 */
import React, {useMemo} from 'react';
import {
  Alert,
  FlatList,
  Linking,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import {View, Text} from 'native-base';
import {useSelector} from 'react-redux';

import {useAppTheme} from 'theme';
import {
  Header,
  SafeAreaContainer,
  IProvider,
  TimelineItem,
  ContentLoader,
} from 'components';
import {RootState} from 'redux/store';
import {RootStackScreenProps} from 'navigation/DrawerNav';

import DisplayAds from '../../components/DisplayAds';
import {useAds, useTrackAdv} from '../../hooks/useAds';
import {openInAppBrowser} from '../../utils';
import {INewsData, useNewsList} from './Queries/useNewsFeed';
import {FeaturedNews} from './FeaturedNews';

function News(props: RootStackScreenProps<'News'>) {
  const {navigation} = props;
  const theme = useAppTheme();
  const {colors} = theme;
  const {newsAdvertisements} = useSelector(
    (state: RootState) => state.advertisement,
  );

  const {newsList, isLoading, refetch, isFetchingNextPage, onEndReached} =
    useNewsList();

  const {data} = useAds({page: 'news'});
  const {handleAdvTrack} = useTrackAdv();

  const [maPosition, mbPosition] = useMemo(() => {
    return [
      data?.filter(x => x.position === 'MA'),
      data?.filter(x => x.position === 'MB'),
    ];
  }, [data]);

  const onSelect = (type: string, id: string) => {
    if (type === 'news') {
      navigation.push('ArticleDetails', {id});
    }
  };

  const handleClickAdv = async (url: string, adId: string) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        openInAppBrowser(url);
        handleAdvTrack({
          adId,
          event: 'click',
        });
      } else {
        Alert.alert('err');
      }
    });
  };

  const handleOnImpression = (adId: string) => {
    try {
      handleAdvTrack({
        adId,
        event: 'impression',
      });
    } catch (error) {
      console.log('err', error);
    }
  };

  const renderItem: ListRenderItem<INewsData> = ({item, index}) => {
    const key = `all_news_item-${item?.documentID}-${index}`;
    const provider: IProvider = {
      postProvider: item.provider?.name,
      postProviderId: item.provider?.documentID,
      postProviderLogo: item.provider?.logo,
      providerUrl: item.provider?.url,
    };

    const adIndex = index + 1;
    const showAd = Boolean(index && adIndex % 4 === 0);

    return (
      <>
        <TimelineItem
          id={item.documentID}
          image={item.thumbnail}
          key={key}
          name={item.provider.name}
          navigation={navigation}
          postedAt={item.updateDate}
          provider={provider}
          title={item.title}
          type="news"
          onSelect={onSelect}
        />
        {showAd ? (
          <DisplayAds
            adIndex={adIndex}
            dataList={newsAdvertisements}
            handleOnImpression={handleOnImpression}
            onPress={handleClickAdv}
          />
        ) : null}
      </>
    );
  };

  const keyExtractor = React.useCallback(
    (item: INewsData, index: number) =>
      `news-page-key-${index}-${item.documentID}`,
    [],
  );

  return (
    <SafeAreaContainer edges={['top', 'bottom']}>
      <Header />
      <View flex={1}>
        <FlatList
          contentContainerStyle={styles.listContent}
          data={newsList}
          keyExtractor={keyExtractor}
          ListEmptyComponent={isLoading ? <ContentLoader /> : null}
          ListFooterComponent={
            isFetchingNextPage ? <ContentLoader count={1} /> : null
          }
          ListHeaderComponent={
            <>
              <FeaturedNews
                advertisement={maPosition}
                handleClickAdv={handleClickAdv}
                handleOnImpression={handleOnImpression}
                navigation={navigation}
                onSelect={onSelect}
              />
              {!isLoading ? (
                <>
                  <DisplayAds
                    adIndex={4}
                    dataList={mbPosition}
                    handleOnImpression={handleOnImpression}
                    onPress={handleClickAdv}
                  />
                  <View pt={2} px={4} width="full">
                    <Text
                      color={colors.black[800]}
                      fontSize="2xl"
                      fontWeight={700}>
                      All News
                    </Text>
                  </View>
                </>
              ) : null}
            </>
          }
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={refetch} />
          }
          refreshing={isLoading}
          renderItem={renderItem}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.8}
        />
      </View>
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  listContent: {
    flexGrow: 1,
  },
});

export default News;

/**
 * @format
 */
import * as React from 'react';
import {
  FlatList,
  Linking,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import {View, Text} from 'native-base';
import {RootStackScreenProps} from 'navigation/DrawerNav';
import {useAppTheme} from 'theme';
import {
  SafeAreaContainer,
  Header,
  IProvider,
  TimelineItem,
  ContentLoader,
} from 'components';
import {useSelector} from 'react-redux';
import {RootState} from 'redux/store';
import {useBeyondHeadlines} from './useBeyondHeadlines';
import {FeaturedPosts} from './FeaturedPosts';
import {IShortNews} from '../News/Queries/useNewsFeed';
import {
  BusinessPostItem,
  BusinessPostInfo,
} from '../BusinessDetail/BusinessPosts/BusinessPostItem';
import {useAds, useTrackAdv} from '../../hooks/useAds';
import DisplayAds from '../../components/DisplayAds';
import {openInAppBrowser} from '../../utils';

function Home(props: RootStackScreenProps<'Home'>) {
  const {navigation} = props;
  const {homeViewAllAdv} = useSelector(
    (state: RootState) => state.advertisement,
  );

  const {colors} = useAppTheme();
  const {
    list = [],
    isLoading,
    refetch,
    isFetchingNextPage,
    onEndReached,
  } = useBeyondHeadlines();
  const {data} = useAds({page: 'home'});

  const {handleAdvTrack} = useTrackAdv();

  const [maPosition, mbPosition] = React.useMemo(() => {
    return [
      data?.filter(x => x.position === 'MA'),
      data?.filter(x => x.position === 'MB'),
    ];
  }, [data]);

  const onSelect = (type: string, id: string) => {
    if (type === 'news') {
      navigation.push('ArticleDetails', {id});
    } else if (type === 'podcasts') {
      navigation.push('PodcastDetail', {episodeID: id});
    }
  };

  const onSelectPost = async (info: BusinessPostInfo) => {
    navigation.push('BusinessSinglePost', {postId: info.contentID});
  };

  const onSelectProvider = async (info: BusinessPostInfo) => {
    navigation.push('BusinessDetail', {businessId: info.businessId});
  };

  const handleClickAdv = (url: string, adId: string) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        openInAppBrowser(url);
        const trackData = {adId, event: 'click'};
        handleAdvTrack(trackData);
      } else {
        console.log('error');
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

  const renderItem: ListRenderItem<IShortNews> = ({item, index}) => {
    const key = `view-all-item-${item?.postId}-${index}`;

    const provider: IProvider = {
      postProvider: item.postProvider,
      postProviderId: item.postProviderId,
      providerUrl: item.providerUrl,
    };

    const adIndex = index + 1;
    const showAd = Boolean(index && adIndex % 4 === 0);

    return (
      <>
        {item.type === 'business' ? (
          <BusinessPostItem
            businessId={item.postProviderId}
            commentsCount={item.commentsCount}
            contentID={item.postId}
            imageURL={item.thumbnail}
            isLiked={item.isLiked}
            key={key}
            likesCount={item.likesCount}
            logoUrl={item.postProviderLogo}
            textContent={item.description}
            updatedAt={item.postedAt}
            userName={item.postProvider}
            onComments={onSelectPost}
            onLike={onSelectPost}
            onPostSelect={onSelectPost}
            onProviderSelect={onSelectProvider}
          />
        ) : (
          <TimelineItem
            id={item.postId}
            image={item.thumbnail}
            key={key}
            name={item.postProvider}
            navigation={navigation}
            postedAt={item.postedAt}
            provider={provider}
            title={item.title}
            type={item.type}
            onSelect={onSelect}
          />
        )}
        {showAd ? (
          <DisplayAds
            adIndex={adIndex}
            dataList={homeViewAllAdv}
            handleOnImpression={handleOnImpression}
            onPress={handleClickAdv}
          />
        ) : null}
      </>
    );
  };

  const keyExtractor = React.useCallback(
    (item: IShortNews, index: number) =>
      `timeline-beyond-news-key-${index}-${item.postId}`,
    [],
  );

  return (
    <SafeAreaContainer edges={['top', 'bottom']} key="home-safe-area">
      <Header key="home-header" />
      <View flex={1}>
        <FlatList
          contentContainerStyle={styles.listContent}
          data={list}
          key="home-page-timeline"
          keyExtractor={keyExtractor}
          ListEmptyComponent={isLoading ? <ContentLoader /> : null}
          ListFooterComponent={
            isFetchingNextPage ? <ContentLoader count={1} /> : null
          }
          ListHeaderComponent={
            <>
              <FeaturedPosts
                advertisement={maPosition}
                handleClickAdv={handleClickAdv}
                handleOnImpression={handleOnImpression}
                key="home-featured-posts"
                navigation={navigation}
                onBusinessPostSelect={onSelectPost}
                onSelect={onSelect}
                onSelectProvider={onSelectProvider}
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
                      View All
                    </Text>
                  </View>
                </>
              ) : null}
            </>
          }
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={refetch} />
          }
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

export default Home;

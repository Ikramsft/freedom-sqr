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
import {DrawerNavProps} from 'navigation/DrawerNav';
import {useAppTheme} from 'theme';
import {
  Button,
  Header,
  SafeAreaContainer,
  IProvider,
  TimelineItem,
  ContentLoader,
} from 'components';
import DisplayAds from 'components/DisplayAds';
import {useFollowing} from './Queries/useFollowing';
import {PreferencesIcon} from '../../assets/svg';
import {IShortNews} from '../News/Queries/useNewsFeed';
import {
  BusinessPostInfo,
  BusinessPostItem,
} from '../BusinessDetail/BusinessPosts/BusinessPostItem';
import {useAds, useTrackAdv} from '../../hooks/useAds';
import {openInAppBrowser} from '../../utils';

type Props = DrawerNavProps<'Following'>;

function Following(props: Props) {
  const {navigation} = props;

  const {colors} = useAppTheme();
  const {
    newsList = [],
    isLoading,
    refetch,
    isRefetching,
    isFetchingNextPage,
    onEndReached,
  } = useFollowing();

  const {data} = useAds({page: 'following'});
  const {handleAdvTrack} = useTrackAdv();

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

  const renderItem: ListRenderItem<IShortNews> = ({item, index}) => {
    const key = `following-item-${item?.postId}-${index}`;

    const provider: IProvider = {
      postProvider: item.postProvider,
      postProviderId: item.postProviderId,
      providerUrl: item.providerUrl,
    };

    const adIndex = index + 1;
    const showAd = Boolean(index && adIndex % 5 === 0);

    return (
      <>
        {showAd ? (
          <DisplayAds
            adIndex={adIndex}
            dataList={filteredMA}
            handleOnImpression={handleOnImpression}
            onPress={handleClickAdv}
          />
        ) : null}
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
      </>
    );
  };

  const keyExtractor = React.useCallback(
    (item: IShortNews, index: number) =>
      `following-timeline-key-${index}-${item.postId}`,
    [],
  );

  const openPref = () => navigation.push('Preference');

  return (
    <SafeAreaContainer edges={['top', 'bottom']}>
      <Header />
      <View flex={1}>
        <FlatList
          contentContainerStyle={styles.listContent}
          data={newsList as IShortNews[]}
          keyExtractor={keyExtractor}
          ListEmptyComponent={
            isLoading || isRefetching ? (
              <ContentLoader />
            ) : (
              <View alignItems="center" mt={6}>
                <Text>No posts available</Text>
              </View>
            )
          }
          ListFooterComponent={
            isFetchingNextPage ? <ContentLoader count={1} /> : null
          }
          ListHeaderComponent={
            <View pt={2} px={4} width="full">
              <View
                alignItems="flex-start"
                flexDirection="row"
                justifyContent="space-between"
                width="full">
                <View flex={1} flexDirection="column" pr={2}>
                  <Text
                    color={colors.black[800]}
                    fontSize="2xl"
                    fontWeight={700}
                    testID="title-following">
                    Following
                  </Text>
                  <Text
                    color={colors.black[800]}
                    fontSize={12}
                    fontWeight="300"
                    mt={1}>
                    Recommended based on your preferences.
                  </Text>
                </View>
                <Button
                  fontSize={12}
                  fontWeight="400"
                  lineHeight={16}
                  startIcon={<PreferencesIcon color={colors.white[900]} />}
                  testID="preferences-button"
                  textTransform="uppercase"
                  title="PREFERENCES"
                  onPress={openPref}
                />
              </View>
            </View>
          }
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={refetch} />
          }
          refreshing={isLoading}
          renderItem={renderItem}
          testID="following-items-list"
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

export default Following;

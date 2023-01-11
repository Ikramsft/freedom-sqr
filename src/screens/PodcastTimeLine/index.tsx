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
import {Text, View} from 'native-base';
import {useSelector} from 'react-redux';

import {useAppTheme} from 'theme';
import {
  Header,
  SafeAreaContainer,
  TimelineItem,
  ContentLoader,
} from 'components';
import {RootState} from 'redux/store';
import {RootStackScreenProps} from 'navigation/DrawerNav';

import {
  IPodcastEpisode,
  IPodcastImage,
} from '../PodcastsChannel/Queries/usePodcastsEpisodes';
import {FeaturedPodcasts} from './FeaturedPodcasts';
import {usePodcastsTimeline} from './Queries/usePodcastsTimeline';
import DisplayAds from '../../components/DisplayAds';
import {useAds, useTrackAdv} from '../../hooks/useAds';
import {openInAppBrowser} from '../../utils';

function PodcastTimeline(props: RootStackScreenProps<'PodcastTimeline'>) {
  const theme = useAppTheme();
  const {navigation} = props;
  const {podCastAdvertisements} = useSelector(
    (state: RootState) => state.advertisement,
  );

  const {
    allPodcastsList,
    isLoading,
    refetch,
    isFetchingNextPage,
    onEndReached,
  } = usePodcastsTimeline();

  const {data} = useAds({page: 'podcasts'});
  const {handleAdvTrack} = useTrackAdv();

  const [maPosition, mbPosition] = useMemo(() => {
    return [
      data?.filter(x => x.position === 'MA'),
      data?.filter(x => x.position === 'MB'),
    ];
  }, [data]);

  const onSelect = (_type: string, id: string) => {
    navigation.push('PodcastDetail', {episodeID: id});
  };

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

  const renderItem: ListRenderItem<IPodcastEpisode> = ({item, index}) => {
    const key = `all_podcast_item_${item?.episodeID}`;

    const pImage: IPodcastImage[] = item?.images
      ? JSON.parse(item?.images)
      : [];
    const imageUrl = pImage.length > 1 ? pImage[1].url : undefined;

    const podcastProviderLogo: IPodcastImage[] = item?.externalShowImages
      ? JSON.parse(item.externalShowImages)
      : [];

    const provider = {
      postProvider: item.podcastShowName,
      postProviderId: item.podcastShowID,
      postProviderLogo: podcastProviderLogo?.[0]?.url ?? undefined,
      providerUrl: item.podcastShowUrl,
    };

    const adIndex = index + 1;
    const showAd = Boolean(index && adIndex % 4 === 0);

    return (
      <>
        <TimelineItem
          id={item.episodeID}
          image={imageUrl}
          key={key}
          name={item.podcastShowName}
          navigation={navigation}
          postedAt={item.externalCreatedAt}
          provider={provider}
          title={item.episodeName}
          type="podcasts"
          onSelect={onSelect}
        />
        {showAd ? (
          <DisplayAds
            adIndex={adIndex}
            dataList={podCastAdvertisements}
            handleOnImpression={handleOnImpression}
            onPress={handleClickAdv}
          />
        ) : null}
      </>
    );
  };

  const keyExtractor = React.useCallback(
    (item: IPodcastEpisode, index: number) => `key-${index}-${item.episodeID}`,
    [],
  );

  return (
    <SafeAreaContainer edges={['top', 'bottom']}>
      <Header />
      <FlatList
        contentContainerStyle={styles.listContent}
        data={allPodcastsList}
        keyExtractor={keyExtractor}
        ListEmptyComponent={isLoading ? <ContentLoader /> : null}
        ListFooterComponent={
          isFetchingNextPage ? <ContentLoader count={1} /> : null
        }
        ListHeaderComponent={
          <>
            <FeaturedPodcasts
              advertisement={maPosition}
              handleClickAdv={handleClickAdv}
              handleOnImpression={handleOnImpression}
              navigation={navigation}
              onSelect={onSelect}
            />

            {!isLoading && (
              <>
                <DisplayAds
                  adIndex={5}
                  dataList={mbPosition}
                  handleOnImpression={handleOnImpression}
                  onPress={handleClickAdv}
                />
                <View pt={2} px={4} width="full">
                  <Text
                    color={theme.colors.black[800]}
                    fontSize="2xl"
                    fontWeight={700}>
                    All Podcasts
                  </Text>
                </View>
              </>
            )}
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
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  listContent: {
    flexGrow: 1,
  },
});

export default PodcastTimeline;

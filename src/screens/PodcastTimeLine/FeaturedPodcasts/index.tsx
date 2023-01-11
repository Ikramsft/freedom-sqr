/**
 * @format
 */
import React from 'react';
import {View, Text} from 'native-base';

import {TimelineItem, ContentLoader} from 'components';
import DisplayAds from 'components/DisplayAds';
import {IAdsItem} from 'hooks/useAds';
import {RootStackNavigationProps} from 'navigation/DrawerNav';
import {useAppTheme} from 'theme';

import {useFeaturedPodcasts} from './useFeaturedPodcasts';
import {IPodcastImage} from '../../PodcastsChannel/Queries/usePodcastsEpisodes';

interface Props {
  onSelect: (type: string, id: string) => void;
  navigation: RootStackNavigationProps<'PodcastTimeline'>;
  advertisement: IAdsItem[] | undefined;
  handleClickAdv: (url: string, adId: string) => void;
  handleOnImpression: (adId: string) => void;
}

function FeaturedPodcasts(props: Props) {
  const {
    advertisement,
    handleClickAdv,
    handleOnImpression,
    onSelect,
    navigation,
  } = props;

  const {colors} = useAppTheme();
  const {data = [], isLoading} = useFeaturedPodcasts();
  const DIVIDER = data?.length > 5 ? 5 : 2;

  return (
    <View mb={6}>
      {!isLoading && (
        <View pt={2} px={4} width="full">
          <Text color={colors.black[800]} fontSize="2xl" fontWeight={700}>
            Featured Podcasts
          </Text>
        </View>
      )}
      {isLoading ? <ContentLoader /> : null}
      {!isLoading && data && data.length === 0 && (
        <View pt={2} px={4} width="full">
          <Text fontWeight="bold">No featured podcasts available</Text>
        </View>
      )}
      {!isLoading &&
        data &&
        data.length > 0 &&
        data.map((item, index) => {
          const key = `featured_podcast_item_${item?.episodeID}`;
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
          const showAd = Boolean(index && adIndex % DIVIDER === 0);

          return (
            <>
              {showAd ? (
                <DisplayAds
                  adIndex={5}
                  dataList={advertisement}
                  handleOnImpression={handleOnImpression}
                  onPress={handleClickAdv}
                />
              ) : null}

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
            </>
          );
        })}
    </View>
  );
}

export {FeaturedPodcasts};

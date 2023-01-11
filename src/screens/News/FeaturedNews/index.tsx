/**
 * @format
 */
import React from 'react';
import {View, Text} from 'native-base';
import {RootStackNavigationProps} from 'navigation/DrawerNav';
import {useAppTheme} from 'theme';
import {IProvider, TimelineItem, ContentLoader} from 'components';
import DisplayAds from 'components/DisplayAds';
import {IAdsItem} from 'hooks/useAds';
import {useFeaturedNews} from './useFeaturedNews';

interface Props {
  onSelect: (type: string, id: string) => void;
  navigation: RootStackNavigationProps<'News'>;
  advertisement: IAdsItem[] | undefined;
  handleClickAdv: (url: string, adId: string) => void;
  handleOnImpression: (adId: string) => void;
}

function FeaturedNews(props: Props) {
  const {
    advertisement,
    handleClickAdv,
    handleOnImpression,
    onSelect,
    navigation,
  } = props;

  const theme = useAppTheme();
  const {colors} = theme;
  const {data = [], isLoading} = useFeaturedNews();

  const DIVIDER = data?.length > 5 ? 5 : 2;

  return (
    <View mb={6}>
      {!isLoading && (
        <View pt={2} px={4} width="full">
          <Text color={colors.black[800]} fontSize="2xl" fontWeight={700}>
            Featured News
          </Text>
        </View>
      )}
      {isLoading ? <ContentLoader /> : null}
      {!isLoading && data && data.length === 0 && (
        <View pt={2} px={4} width="full">
          <Text fontWeight="bold">No featured news available</Text>
        </View>
      )}
      {!isLoading &&
        data &&
        data.length > 0 &&
        data.map((item, index) => {
          const key = `featured_news_item_${item?.documentID}`;
          const provider: IProvider = {
            postProvider: item.provider?.name,
            postProviderId: item.provider?.documentID,
            postProviderLogo: item.provider?.logo,
            providerUrl: item.provider?.url,
          };

          const adIndex = index + 1;
          const showAd = Boolean(index && adIndex % DIVIDER === 0);

          return (
            <>
              {showAd ? (
                <DisplayAds
                  adIndex={4}
                  dataList={advertisement}
                  handleOnImpression={handleOnImpression}
                  onPress={handleClickAdv}
                />
              ) : null}

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
            </>
          );
        })}
    </View>
  );
}

export {FeaturedNews};

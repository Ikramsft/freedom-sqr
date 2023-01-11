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
import {useFeaturedPosts} from './useFeaturedPosts';
import {SignUpBox} from '../SignupBox';
import {useUserInfo} from '../../../hooks/useUserInfo';
import {
  BusinessPostItem,
  BusinessPostInfo,
} from '../../BusinessDetail/BusinessPosts/BusinessPostItem';

interface Props {
  onSelect: (type: string, id: string) => void;
  onBusinessPostSelect: (info: BusinessPostInfo) => void;
  onSelectProvider: (info: BusinessPostInfo) => void;
  navigation: RootStackNavigationProps<'Home'>;
  advertisement: IAdsItem[] | undefined;
  handleClickAdv: (url: string, adId: string) => void;
  handleOnImpression: (adId: string) => void;
}

function FeaturedPosts(props: Props) {
  const {
    handleOnImpression,
    advertisement,
    handleClickAdv,
    onSelect,
    onBusinessPostSelect,
    onSelectProvider,
    navigation,
  } = props;
  const {authenticated} = useUserInfo();
  const {colors} = useAppTheme();
  const {data = [], isLoading} = useFeaturedPosts();

  return (
    <View key="FeaturedPosts" mb={6}>
      {!isLoading && (
        <View pt={2} px={4} width="full">
          <Text color={colors.black[800]} fontSize="2xl" fontWeight={700}>
            Featured Posts
          </Text>
        </View>
      )}
      {isLoading ? <ContentLoader /> : null}
      {!isLoading && data?.length
        ? data.map((item, index) => {
            const provider: IProvider = {
              postProvider: item.postProvider,
              postProviderId: item.postProviderId,
              postProviderLogo: item.postProviderLogo,
              providerUrl: item.providerUrl,
            };

            const key = `timeline-featured-post-item-${item?.postId}-${index}`;

            const adIndex = index + 1;
            const showAd = Boolean(index && adIndex % 5 === 0);

            return (
              <React.Fragment key={`fragment-${key}`}>
                {index === 1 && !authenticated ? (
                  <SignUpBox key="signupBox" navigation={navigation} />
                ) : null}
                {showAd ? (
                  <DisplayAds
                    adIndex={adIndex}
                    dataList={advertisement}
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
                    px={5}
                    textContent={item.description}
                    updatedAt={item.postedAt}
                    userName={item.postProvider}
                    onComments={onBusinessPostSelect}
                    onLike={onBusinessPostSelect}
                    onPostSelect={onBusinessPostSelect}
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
              </React.Fragment>
            );
          })
        : null}
    </View>
  );
}

export {FeaturedPosts};

/**
 * @format
 */
import React from 'react';
import {Image, Text, View} from 'native-base';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {
  getNewsProviderLogo,
  isJsonString,
  isValidURL,
  timeDiffCalc,
} from '../../utils';
import {SafeTouchable} from '../SafeTouchable';
import {likeFrom} from '../../screens/PodcastTimeLine/Queries/useEpisodeActions';
import {ProgressImage} from '../ProgressImage';
import {RootStackParamList} from '../../navigation';
import {AppNavigationType} from '../../navigation/DrawerNav';

export interface IProvider {
  postProvider: string;
  postProviderId: string;
  postProviderLogo?: string;
  providerUrl: string;
}

type NavigationType =
  | NativeStackNavigationProp<RootStackParamList, 'News'>
  | NativeStackNavigationProp<RootStackParamList, 'Home'>
  | NativeStackNavigationProp<RootStackParamList, 'PodcastTimeline'>
  | AppNavigationType<'Following'>
  | AppNavigationType<'Profile'>
  | AppNavigationType<'Search'>;

interface Props {
  id: string;
  image: string | undefined;
  name: string;
  title: string;
  type: likeFrom | string;
  postedAt: string;
  onSelect?: (type: string, id: string) => void;
  navigation: NavigationType;
  provider: IProvider;
}

function TimelineItem(props: Props) {
  const {
    id,
    image,
    name,
    title,
    type,
    postedAt,
    onSelect,
    navigation,
    provider,
  } = props;

  const onPress = () => onSelect?.(type, id);

  const onNamePress = () => {
    if (type === 'podcasts') {
      navigation.push('PodcastsChannel', {
        postProviderId: provider.postProviderId,
      });
    } else {
      navigation.navigate('NewsProviderWall', {provider});
    }
  };

  const key = `timeline-${id}-${title}`;

  const source =
    type === 'news'
      ? getNewsProviderLogo(type, name)
      : type === 'business' || type === 'podcasts'
      ? isValidURL(provider.postProviderLogo)
        ? {uri: provider.postProviderLogo}
        : undefined
      : undefined;

  const attachedImage = image
    ? isJsonString(image)
      ? JSON.parse(image)[0]?.url
      : image
    : undefined;

  return (
    <SafeTouchable activeOpacity={0.8} key={key} onPress={onPress}>
      <View p={4}>
        <View display="flex" flexDirection="row" width="full">
          <View flex={1}>
            <SafeTouchable onPress={() => onNamePress()}>
              <View flexDirection="row">
                {source ? (
                  <Image
                    alt="provider-logo"
                    height={5}
                    mr={2}
                    source={source}
                    width={5}
                  />
                ) : (
                  <View
                    alignItems="center"
                    backgroundColor="gray.500"
                    height={5}
                    mr={2}
                    width={5}>
                    <Text color="white.900">{name.charAt(0)}</Text>
                  </View>
                )}
                <Text>{name}</Text>
              </View>
            </SafeTouchable>
            <View
              borderLeftColor="gray.500"
              borderLeftWidth={0.5}
              ml={2}
              mt={2}
              pl={3}
              pr={2}>
              <Text fontWeight="bold">{title}</Text>
              <View alignItems="center" flexDirection="row" mt={2}>
                {type && (
                  <>
                    <Text bold textTransform="uppercase">
                      {type.replace('_', ' ')}
                    </Text>
                    <View
                      backgroundColor="black.900"
                      height={1}
                      mx={2}
                      rounded="full"
                      width={1}
                    />
                  </>
                )}
                <Text>{timeDiffCalc(postedAt)}</Text>
              </View>
            </View>
          </View>
          <View>
            {image ? (
              <ProgressImage
                borderRadius={5}
                height={100}
                resizeMode="cover"
                source={{uri: attachedImage}}
                width={100}
              />
            ) : null}
          </View>
        </View>
      </View>
      <View borderBottomColor="gray.500" borderBottomWidth={1} ml={6} mr={2} />
    </SafeTouchable>
  );
}

TimelineItem.defaultProps = {
  onSelect: undefined,
};

export {TimelineItem};

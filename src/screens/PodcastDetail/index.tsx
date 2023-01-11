/**
 * @format
 */
import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView as RNScrollView} from 'react-native';
import {Divider, Image, Spinner, Text, View} from 'native-base';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Octicons from 'react-native-vector-icons/Octicons';
import Entypo from 'react-native-vector-icons/Entypo';

import {RootStackScreenProps} from 'navigation/DrawerNav';
import {useAppTheme} from 'theme';
import {
  Button,
  SafeTouchable,
  HeaderLeft,
  HeaderTitle,
  SafeAreaContainer,
  ConditionalWrapper,
  Title,
  SubTitle,
  Error,
  ProgressImage,
  SpotifyPlayerContainer,
  ScrollView,
} from 'components';

import {PodcastComments} from './PodcastComments';
import {usePodcastDetails} from './Queries/usePodcastDetail';
import {formatCount, timeDiffCalc} from '../../utils';
import {useUserInfo} from '../../hooks/useUserInfo';
import {usePodcastFollowActions} from './Queries/usePodcastFollowActions';
import {SCREEN_WIDTH} from '../../constants';
import {useEpisodeActions} from '../PodcastTimeLine/Queries/useEpisodeActions';
import {LikeColorIcon} from '../../assets/svg';
import {IPodcastImage} from '../PodcastsChannel/Queries/usePodcastsEpisodes';
import useShare from '../../hooks/useShare';

function PodcastDetail(props: RootStackScreenProps<'PodcastDetail'>) {
  const {navigation, route} = props;
  const theme = useAppTheme();

  const scrollPositions = React.useRef({commentsYPosition: 0}).current;
  const scrollRef = React.useRef<RNScrollView | null>(null);

  const {authenticated: isLoggedIn} = useUserInfo();
  const [isFollowing, setIsFollowing] = useState(Boolean(false));
  const [isLiking, setIsLiking] = useState(Boolean(false));
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  const {tryFollowPodcast, tryUnfollowPodcast} = usePodcastFollowActions();
  const {episodeLikeToggle} = useEpisodeActions();
  const {share} = useShare();

  React.useLayoutEffect(() => {
    const headerLeft = () => <HeaderLeft onPress={navigation.goBack} />;
    const headerTitle = () => <HeaderTitle title="Podcast Player" />;
    navigation.setOptions({
      headerShown: true,
      headerBackVisible: false,
      headerTitleAlign: 'center',
      headerTitle,
      headerLeft,
      headerRight: () => null,
    });
  }, [navigation]);

  const {data, isLoading, isError, refetch} = usePodcastDetails(
    route.params.episodeID,
  );

  const episodeImage = React.useMemo(() => {
    const epImages = data?.images ? JSON.parse(data?.images) : {};
    return epImages ? epImages[1]?.url : undefined;
  }, [data?.images]);

  useEffect(() => {
    if (data && data.isFollowed) {
      setIsFollowing(true);
    } else if (data && !data.isFollowed) {
      setIsFollowing(false);
    }
  }, [data]);

  const onSuccess = useCallback(
    (success: boolean) => {
      if (success) {
        setIsFollowing(!isFollowing);
      }
      setIsFollowLoading(false);
    },
    [isFollowing],
  );

  if (isLoading) {
    return (
      <SafeAreaContainer>
        <View alignItems="center" flexGrow={1} justifyContent="center">
          <Spinner />
        </View>
      </SafeAreaContainer>
    );
  }

  if (!data || isError) {
    return (
      <SafeAreaContainer>
        <Error retry={refetch} />
      </SafeAreaContainer>
    );
  }

  const {
    episodeName,
    likeCount,
    commentCount,
    externalID,
    podcastShowName,
    podcastShowID,
    episodeDescription,
    isLiked,
    externalCreatedAt,
    externalShowImages,
  } = data;

  const onLikeEpisode = async () => {
    if (isLoggedIn) {
      setIsLiking(true);
      await episodeLikeToggle(route.params.episodeID, 'timeline', !isLiked);
      setIsLiking(false);
    } else {
      navigation.navigate('Login');
    }
  };

  const commentDisplayText =
    commentCount > 0
      ? `${commentCount} ${commentCount > 1 ? 'Comments' : 'Comment'} `
      : '0 Comment';

  const likeText = formatCount(likeCount);
  const likeDisplayText =
    likeCount > 0
      ? `${likeText} ${likeCount > 1 ? 'Likes' : 'Like'} `
      : '0 Like';

  const podcastUrl = `https://open.spotify.com/embed/episode/${externalID}?utm_source=generator`;

  const follow = () => {
    if (isLoggedIn) {
      setIsFollowLoading(true);
      tryFollowPodcast(podcastShowID, onSuccess);
    } else {
      navigation.navigate('Login');
    }
  };

  const unfollow = () => {
    if (isLoggedIn) {
      setIsFollowLoading(true);
      tryUnfollowPodcast(podcastShowID, onSuccess);
    } else {
      navigation.navigate('Login');
    }
  };

  const toggleFollow = () => {
    if (isFollowing) {
      unfollow();
    } else {
      follow();
    }
  };

  const onComment = () => {
    if (isLoggedIn) {
      scrollRef?.current?.scrollTo({
        y: scrollPositions.commentsYPosition,
        animated: true,
      });
    } else {
      navigation.navigate('Login');
    }
  };

  const onShare = async () => {
    if (isLoggedIn) {
      console.log({
        type: 'PodcastDetails',
        title: data?.episodeName,
        documentId: data?.episodeID,
      });
      await share({
        type: 'PodcastDetails',
        title: data?.episodeName,
        documentId: data?.episodeID,
        dialogTitle: 'Share Podcasts',
      });
    } else {
      navigation.navigate('Login');
    }
  };

  const gotoLogin = () => navigation.navigate('Login');

  const podcastProviderLogo: IPodcastImage[] = externalShowImages
    ? JSON.parse(externalShowImages)
    : [];

  const onProvider = () => {
    navigation.navigate('PodcastsChannel', {postProviderId: podcastShowID});
  };

  const onLayout = (yPos: number) => {
    scrollPositions.commentsYPosition = yPos;
  };

  return (
    <SafeAreaContainer>
      <ScrollView
        innerRef={ref => {
          scrollRef.current = ref as unknown as RNScrollView;
        }}
        showsVerticalScrollIndicator={false}>
        <View mt={2} px={4}>
          <View>
            <View display="flex" flexDirection="row" width="full">
              <View flex={1}>
                <SafeTouchable onPress={onProvider}>
                  <View flexDirection="row">
                    <Image
                      alt="provider-logo"
                      height={6}
                      mr={2}
                      source={{uri: podcastProviderLogo?.[0]?.url}}
                      width={6}
                    />
                    <Text bold fontSize={16}>
                      {podcastShowName}
                    </Text>
                  </View>
                </SafeTouchable>
                <View ml={3} pl="23px" pr={2}>
                  <View alignItems="center" flexDirection="row">
                    <Text bold textTransform="uppercase">
                      PODCAST
                    </Text>
                    <View
                      backgroundColor="black.900"
                      height={1}
                      mx={2}
                      rounded="full"
                      width={1}
                    />
                    <SubTitle fontSize="xs">
                      {timeDiffCalc(externalCreatedAt)}
                    </SubTitle>
                  </View>
                </View>
              </View>
            </View>
            <View mt={3}>
              <ProgressImage
                height={SCREEN_WIDTH * 0.9}
                source={{uri: episodeImage}}
              />
              <Title fontSize={16} mt={3}>
                {episodeName}
              </Title>
            </View>
          </View>
          <View>
            <ConditionalWrapper
              condition={!isLoggedIn}
              // eslint-disable-next-line react/no-unstable-nested-components
              wrapper={children => (
                <SafeTouchable activeOpacity={0.9} onPress={gotoLogin}>
                  <View pointerEvents="none">{children}</View>
                </SafeTouchable>
              )}>
              <SpotifyPlayerContainer uri={podcastUrl} />
            </ConditionalWrapper>
            <View flexDirection="row" justifyContent="space-between" my={3}>
              <SafeTouchable
                onPress={() => (!isLiking ? onLikeEpisode() : null)}>
                <View flexDirection="row" justifyContent="center">
                  {isLiking ? (
                    <View justifyContent="center">
                      <Spinner size={12} />
                    </View>
                  ) : (
                    <View justifyContent="center">
                      {!isLiked ? (
                        <LikeColorIcon />
                      ) : (
                        <AntDesign
                          name="like2"
                          style={{color: theme.colors.red[900]}}
                        />
                      )}
                    </View>
                  )}

                  <Text
                    color={
                      isLiked
                        ? theme?.colors?.blue[500]
                        : theme?.colors?.black[700]
                    }
                    fontSize={12}
                    ml={1}>
                    {likeDisplayText}
                  </Text>
                </View>
              </SafeTouchable>
              <SafeTouchable onPress={onComment}>
                <View flexDirection="row">
                  <View justifyContent="center">
                    <Octicons
                      name="comment"
                      style={{color: theme.colors.red[900]}}
                    />
                  </View>
                  <Text fontSize={12} ml={1}>
                    {commentDisplayText}
                  </Text>
                </View>
              </SafeTouchable>
              <SafeTouchable onPress={onShare}>
                <View flexDirection="row">
                  <View justifyContent="center">
                    <Entypo
                      name="share"
                      style={{color: theme.colors.red[900]}}
                    />
                  </View>
                  <Text fontSize={12} ml={1}>
                    Share
                  </Text>
                </View>
              </SafeTouchable>
            </View>
            <View>
              <Text bold>Description</Text>
              <Text fontSize="sm" mt={1}>
                {episodeDescription}
              </Text>
            </View>
            <View
              alignItems="center"
              flexDirection="row"
              justifyContent="space-between"
              mt={2}>
              <View flex={0.8}>
                <Title fontSize="xl">More from {podcastShowName}</Title>
              </View>
              <View>
                <Button
                  backgroundColor={
                    isFollowing
                      ? theme.colors.maroon[900]
                      : theme.colors.brand[950]
                  }
                  fontWeight="400"
                  isDisabled={isFollowLoading}
                  isLoading={isFollowLoading}
                  minWidth={120}
                  size="xs"
                  title={isFollowing ? 'UNFOLLOW' : 'FOLLOW'}
                  onPress={toggleFollow}
                />
              </View>
            </View>
          </View>
          <Divider backgroundColor={theme.colors.gray[300]} mt={3} />
        </View>
        {isLoggedIn ? (
          <PodcastComments
            episodeID={route.params.episodeID}
            onLayout={onLayout}
          />
        ) : null}
      </ScrollView>
    </SafeAreaContainer>
  );
}

export default PodcastDetail;

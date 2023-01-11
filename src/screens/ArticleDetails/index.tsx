/**
 * @format
 */
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {ScrollView as RNScrollView} from 'react-native';
import {Spinner, View, Text} from 'native-base';
import HTML, {defaultSystemFonts} from 'react-native-render-html';

import {RootStackScreenProps} from 'navigation/DrawerNav';
import {useAppTheme} from 'theme';
import {
  Button,
  ScrollView,
  SafeTouchable,
  HeaderLeft,
  HeaderTitle,
  SafeAreaContainer,
  Title,
  Error,
  ProgressImage,
} from 'components';

import {Comments} from './Comments';
import {ProviderInfo} from './ProviderInfo';
import {useArticleDetails} from './Queries/useArticleDetails';
import {openInAppBrowser} from '../../utils';
import {SCREEN_WIDTH} from '../../constants';
import {Reactions} from './Reactions';
import {useUserInfo} from '../../hooks/useUserInfo';
import {fontFamily} from '../../theme/theme';
import {useArticleFollowActions} from './Queries/useArticleFollowActions';
import {useArticleActions} from './Queries/useArticleActions';
import useShare from '../../hooks/useShare';

function ArticleDetails(props: RootStackScreenProps<'ArticleDetails'>) {
  const {navigation, route} = props;

  const {authenticated: isLoggedIn} = useUserInfo();
  const [isFollowing, setIsFollowing] = useState(Boolean(false));
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  const {tryFollowProvider, tryUnfollowProvider} = useArticleFollowActions();

  const {articleLikeToggle} = useArticleActions();

  const scrollPositions = React.useRef({commentsYPosition: 0}).current;
  const scrollRef = React.useRef<RNScrollView | null>(null);

  const {id} = route.params;

  const {share} = useShare();

  const theme = useAppTheme();

  const systemFonts = [...defaultSystemFonts, fontFamily.regular];

  const {
    data: newsArticle,
    isLoading,
    isError,
    refetch,
  } = useArticleDetails(id);

  React.useLayoutEffect(() => {
    const headerLeft = () => <HeaderLeft onPress={navigation.goBack} />;
    const headerTitle = () => <HeaderTitle title="Article Details" />;

    navigation.setOptions({
      headerShown: true,
      headerBackVisible: false,
      headerTitleAlign: 'center',
      headerTitle,
      headerLeft,
      headerRight: () => null,
    });
  }, [navigation]);

  useEffect(() => {
    if (newsArticle?.provider) {
      const bool = Boolean(newsArticle?.provider.isFollowed);
      setIsFollowing(bool);
    } else {
      setIsFollowing(false);
    }
  }, [newsArticle?.provider]);

  const htmlContent = useMemo(
    () => newsArticle?.content || '',
    [newsArticle?.content],
  );

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

  if (isError || !newsArticle) {
    return (
      <SafeAreaContainer>
        <Error retry={refetch} />
      </SafeAreaContainer>
    );
  }

  const onLinkPress = (_: unknown, href: string) => openInAppBrowser(href);

  const onLinkToArticlePress = () => openInAppBrowser(newsArticle?.link);

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

  const onLike = () => {
    if (isLoggedIn) {
      articleLikeToggle(
        newsArticle?.documentID,
        'article_detail',
        !newsArticle?.isLiked,
        newsArticle.providerID,
      );
    } else {
      navigation.navigate('Login');
    }
  };

  const onShare = async () => {
    if (isLoggedIn) {
      await share({
        title: newsArticle?.title,
        type: 'ArticleDetails',
        documentId: newsArticle?.documentID,
        dialogTitle: 'Share News',
      });
    } else {
      navigation.navigate('Login');
    }
  };

  const onLayout = (yPos: number) => {
    scrollPositions.commentsYPosition = yPos;
  };

  const follow = () => {
    if (isLoggedIn) {
      setIsFollowLoading(true);
      tryFollowProvider(newsArticle?.providerID, onSuccess);
    } else {
      navigation.navigate('Login');
    }
  };

  const unfollow = () => {
    if (isLoggedIn) {
      setIsFollowLoading(true);
      tryUnfollowProvider(newsArticle?.providerID, onSuccess);
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

  return (
    <SafeAreaContainer>
      <ScrollView
        innerRef={ref => {
          scrollRef.current = ref as unknown as RNScrollView;
        }}>
        <ProviderInfo
          contentType="NEWS"
          date={newsArticle?.pubDate}
          provider={newsArticle?.provider}
        />
        <View mt={2} px={5}>
          <ProgressImage
            height={SCREEN_WIDTH / 2}
            source={{uri: newsArticle?.thumbnail}}
          />
          <Title fontSize="md" mt={2}>
            {newsArticle?.title}
          </Title>
          <SafeTouchable onPress={onLinkToArticlePress}>
            <Text fontSize="md" mt={2} textDecorationLine="underline">
              Link to the article
            </Text>
          </SafeTouchable>
          <Reactions
            commentCount={newsArticle?.commentsCount || 0}
            isLiked={Boolean(newsArticle?.isLiked)}
            likeCount={newsArticle?.likesCount || 0}
            theme={theme}
            onComment={onComment}
            onLike={onLike}
            onShare={onShare}
          />
          <HTML
            classesStyles={{
              // div[type="video"]
              // work around code for div type="video" causing height issues article link: https://dev.freedomsquare.com/article/cecq6rdr0vpregmt3ed0
              'embed-media': {
                height: (SCREEN_WIDTH * 9) / 16,
                marginTop: 10,
                marginBottom: 20,
              },
              'fn-video': {
                height: (SCREEN_WIDTH * 9) / 16,
                marginTop: 10,
                marginBottom: 20,
              },
            }}
            contentWidth={SCREEN_WIDTH}
            renderersProps={{a: {onPress: onLinkPress}}}
            source={{html: htmlContent}}
            systemFonts={systemFonts}
            tagsStyles={{
              body: {
                fontFamily: fontFamily.regular,
                fontSize: 17,
                lineHeight: 24,
              },
              a: {
                color: theme.colors.blue[500],
                borderBottomColor: theme.colors.blue[500],
              },
            }}
          />
          <View
            alignItems="center"
            flexDirection="row"
            justifyContent="space-between"
            mt={2}>
            <View flex={0.8}>
              <Title fontSize="xl">
                More from {newsArticle?.provider?.name}
              </Title>
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
        {isLoggedIn ? (
          <Comments articleId={newsArticle?.documentID} onLayout={onLayout} />
        ) : null}
      </ScrollView>
    </SafeAreaContainer>
  );
}

export default ArticleDetails;

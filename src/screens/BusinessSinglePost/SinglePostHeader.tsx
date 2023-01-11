/**
 * @format
 */
import React from 'react';
import {StyleProp} from 'react-native';
import {View, Spinner} from 'native-base';
import {IItem} from 'native-base/lib/typescript/components/composites/Typeahead/useTypeahead/types';

import {useAppTheme} from 'theme';
import {
  Button,
  SafeTouchable,
  SafeAreaContainer,
  Title,
  SubTitle,
  Error,
  ProgressImage,
  UserAvatar,
  ReadMoreLessText,
} from 'components';

import {useBusinessSinglePost} from './useBusinessSinglePost';
import {timeDiffCalc} from '../../utils';
import {Reactions} from '../ArticleDetails/Reactions';
import {useUserInfo} from '../../hooks/useUserInfo';
import {useBusinessPostActions} from '../BusinessDetail/BusinessPosts/useBusinessPostActions';
import {useBusinessActions} from '../BusinessTab/Queries/useBusinessActions';
import useShare from '../../hooks/useShare';

interface Props {
  navigation: IItem;
  postId: string;
  onComment: () => void;
}

const imageStyle: StyleProp<any> = {width: '100%', height: 200};

function SinglePostHeader(props: Props) {
  const {navigation, postId, onComment} = props;

  const theme = useAppTheme();
  const {authenticated: isLoggedIn} = useUserInfo();

  const {data, isLoading, isError, refetch} = useBusinessSinglePost(postId);

  const {tryFollowBusiness, tryUnfollowBusiness} = useBusinessActions();

  const {businessPostLikeToggle} = useBusinessPostActions();

  const {share} = useShare();

  const [isFollowing, setIsFollowing] = React.useState<boolean | undefined>();
  const [followLoading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (data) {
      setIsFollowing(Boolean(data?.isFollowing));
    }
  }, [data]);

  const onSuccess = React.useCallback(
    (success: boolean) => {
      if (success) {
        setIsFollowing(!isFollowing);
      }
      setLoading(false);
    },
    [isFollowing],
  );

  const onLike = () => {
    if (!data) {
      return;
    }
    if (isLoggedIn) {
      businessPostLikeToggle(
        data.documentId,
        data.businessId,
        'business_detail',
        !data?.isLiked,
      );
    } else {
      navigation.navigate('Login');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaContainer>
        <Spinner />
      </SafeAreaContainer>
    );
  }

  if (isError || !data) {
    return (
      <SafeAreaContainer>
        <Error retry={refetch} />
      </SafeAreaContainer>
    );
  }

  const onSelectProvider = async () => {
    navigation.push('BusinessDetail', {businessId: data.businessId});
  };

  const unfollow = () => {
    if (data && isLoggedIn) {
      tryUnfollowBusiness(data.businessId, onSuccess);
    } else {
      navigation.navigate('Login');
    }
  };

  const follow = () => {
    if (data && isLoggedIn) {
      setLoading(true);
      tryFollowBusiness(data.businessId, onSuccess);
    } else {
      navigation.navigate('Login');
    }
  };

  const toggleFollow = () => {
    if (isFollowing) {
      setLoading(true);
      unfollow();
    } else {
      follow();
    }
  };

  const handleShare = async () => {
    if (data && isLoggedIn) {
      await share({
        title: data?.businessName,
        type: 'SinglePost',
        documentId: data.documentId,
        dialogTitle: 'Share Business Post',
      });
    } else {
      navigation.navigate('Login');
    }
  };

  return (
    <View>
      <View mt={2}>
        <View flexDirection="row" justifyContent="space-between">
          <View width="75%">
            <SafeTouchable onPress={onSelectProvider}>
              <View flexDirection="row">
                <UserAvatar profilePic={data.logo?.croppedImageReadUrl} />
                <View ml={2}>
                  <Title>{data.businessName}</Title>
                  <SubTitle>{timeDiffCalc(data.updatedAt)}</SubTitle>
                </View>
              </View>
            </SafeTouchable>
          </View>
          {data && data.role !== 'owner' ? (
            <View width="25%">
              <Button
                backgroundColor={
                  isFollowing
                    ? theme.colors.maroon[900]
                    : theme.colors.brand[950]
                }
                fontSize="12px"
                isDisabled={followLoading}
                isLoading={followLoading}
                minWidth={90}
                size="sm"
                title={isFollowing ? 'UNFOLLOW' : 'FOLLOW'}
                onPress={toggleFollow}
              />
            </View>
          ) : null}
        </View>
        <View>
          <ReadMoreLessText mt={1} textAlign="justify" visibleLines={10}>
            {data.textContent}
          </ReadMoreLessText>
        </View>
        {data.image?.imageUrl ? (
          <View mt={2} style={imageStyle}>
            <ProgressImage
              source={{uri: data.image?.imageUrl}}
              style={imageStyle}
            />
          </View>
        ) : null}
        <View
          alignItems="center"
          flexDirection="row"
          justifyContent="space-between"
          mb={2}
          mt={2}>
          <View flex={0.8}>
            <Reactions
              commentCount={Number(data.commentsCount ?? '')}
              isLiked={data.isLiked}
              likeCount={data.likesCount}
              mt={2}
              theme={theme}
              onComment={onComment}
              onLike={onLike}
              onShare={handleShare}
            />
          </View>
        </View>
        <View borderBottomColor="gray.500" borderBottomWidth={1} my={2} />
      </View>
    </View>
  );
}

export default SinglePostHeader;

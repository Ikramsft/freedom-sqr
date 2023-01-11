/**
 * @format
 */
import * as React from 'react';
import {Text, View} from 'native-base';
import {IViewProps} from 'native-base/lib/typescript/components/basic/View/types';

import {useAppTheme} from 'theme';
import {
  SafeTouchable,
  Title,
  SubTitle,
  ProgressImage,
  UserAvatar,
} from 'components';

import {isValidURL, timeDiffCalc} from '../../../../utils';
import {Reactions} from '../../../ArticleDetails/Reactions';

export interface IBusinessPost {
  documentId: string;
  contentID: string;
  userID: string;
  businessID: string;
  contentDataType: string;
  commentsCount: number;
  textContent: string;
  image?: {
    imageID: string;
    imageURL: string;
    createdAt: string;
    updatedAt: string;
  };
  user: {
    userId: string;
    userName: string;
    croppedImageReadUrl: string;
  };
  isFollowing: boolean;
  isLiked: boolean;
  likes: number;
  likesCount: number;
  createdAt: number;
  updatedAt: string;
}

export type BusinessPostInfo = {
  contentID: string;
  businessId: string;
  isLiked?: boolean;
};

interface Props extends IViewProps {
  businessId: string;
  contentID: string;
  logoUrl?: string;
  textContent: string;
  imageURL?: string;
  userName: string;
  commentsCount: number;
  updatedAt: string;
  isLiked: boolean;
  likesCount: number;
  showReactions?: boolean;
  onProviderSelect?: (info: BusinessPostInfo) => void;
  onPostSelect?: (info: BusinessPostInfo) => void;
  onLike?: (info: BusinessPostInfo) => void;
  onComments?: (info: BusinessPostInfo) => void;
  onShare?: (info: BusinessPostInfo) => void;
}

export function BusinessPostItem(props: Props) {
  const {
    businessId,
    contentID,
    logoUrl,
    textContent,
    imageURL,
    userName,
    commentsCount,
    updatedAt,
    isLiked,
    likesCount,
    showReactions,
    onProviderSelect,
    onPostSelect,
    onLike,
    onComments,
    onShare,
    ...rest
  } = props;
  const theme = useAppTheme();

  const key = `info-item-${contentID}`;

  const onPostPress = () => onPostSelect?.({contentID, businessId});
  const onNamePress = () => onProviderSelect?.({contentID, businessId});
  const onSharePress = () => onShare?.({contentID, businessId});

  const onLikePress = () => onLike?.({contentID, businessId, isLiked});
  const onCommentsPress = () => onComments?.({contentID, businessId, isLiked});

  const hasImage = imageURL && isValidURL(imageURL);

  return (
    <View>
      <View key={key} p={4} {...rest}>
        <SafeTouchable disabled={!onProviderSelect} onPress={onNamePress}>
          <View flexDirection="row">
            <UserAvatar profilePic={logoUrl} />
            <View ml={2}>
              <Title>{userName}</Title>
              <SubTitle>{timeDiffCalc(updatedAt)}</SubTitle>
            </View>
          </View>
        </SafeTouchable>
        <SafeTouchable disabled={!onPostSelect} onPress={onPostPress}>
          {textContent !== '' ? (
            <SubTitle mt={1} numberOfLines={2}>
              {textContent}
            </SubTitle>
          ) : null}
          {hasImage && (
            <ProgressImage
              height="200px"
              mt={2}
              source={{uri: imageURL}}
              width="100%"
            />
          )}
        </SafeTouchable>
        <View alignItems="center" flexDirection="row" mt={1}>
          <Text bold textTransform="uppercase">
            BUSINESS
          </Text>
          {showReactions ? (
            <>
              <View
                backgroundColor="black.900"
                height={1}
                mx={2}
                rounded="full"
                width={1}
              />
              <Reactions
                commentCount={commentsCount || 0}
                isLiked={Boolean(isLiked)}
                likeCount={likesCount || 0}
                ml={0}
                mt={0}
                theme={theme}
                onComment={onCommentsPress}
                onLike={onLikePress}
                onShare={onSharePress}
              />
            </>
          ) : null}
        </View>
      </View>
      <View borderBottomColor="gray.500" borderBottomWidth={1} ml={6} mr={2} />
    </View>
  );
}

BusinessPostItem.defaultProps = {
  imageURL: undefined,
  onPostSelect: undefined,
  onProviderSelect: undefined,
  onLike: undefined,
  onComments: undefined,
  onShare: undefined,
  logoUrl: undefined,
  showReactions: false,
};

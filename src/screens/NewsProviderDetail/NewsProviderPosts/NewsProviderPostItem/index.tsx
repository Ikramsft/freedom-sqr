/**
 * @format
 */
import React from 'react';
import {Image, View} from 'native-base';

import {AppTheme} from 'theme';
import {
  SafeTouchable,
  Title,
  SubTitle,
  HTMLText,
  ProgressImage,
  NameAvatar,
} from 'components';

import {getNewsProviderLogo, timeDiffCalc, isValidURL} from '../../../../utils';
import {SCREEN_WIDTH} from '../../../../constants';
import {Reactions} from '../../../ArticleDetails/Reactions';

export interface INewsProviderPost {
  author: string;
  category: string;
  comments: string;
  commentsCount: number;
  content: string;
  desc: string;
  documentID: string;
  guid: string;
  isLiked: boolean;
  likesCount: number;
  link: string;
  mediaContent: {
    url: string;
    type: string;
    title: string;
    audios: [
      {
        url: string;
        type: string;
        secure_url: string;
      },
    ];
    images: [
      {
        url: string;
        type: string;
        width: number;
        height: number;
        secure_url: string;
      },
    ];
    locale: string;
    videos: string;
    article: {
      tags: string;
      authors: string;
      section: string;
      modified_time: string;
      published_time: string;
      expiration_time: string;
    };
    site_name: string;
    determiner: string;
    description: string;
    locales_alternate: string;
  };
  provider: {
    documentID: string;
    eTag: string;
    isFollowed: boolean;
    lastModified: string;
    logo: string;
    name: string;
    rss: string;
    slug: string;
    thumbnail: string;
    url: string;
  };
  providerID: string;
  pubDate: string;
  thumbnail: string;
  title: string;
  updateDate: string;
}

interface Props {
  postProvider: string;
  item: INewsProviderPost;
  theme: AppTheme;
  onSelect?: (id: string) => void;
}

export function NewsProviderPostView(props: Props) {
  const {item, postProvider, theme, onSelect} = props;

  const source = getNewsProviderLogo('news', postProvider);

  const onItemPress = () => onSelect?.(item.documentID);

  const html = `<p>${item.desc}</p>`;

  return (
    <SafeTouchable activeOpacity={0.8} onPress={onItemPress}>
      <View px={3}>
        <View alignItems="center" flexDirection="row" height="40px">
          {source ? (
            <Image
              alt="provider-logo"
              height="25px"
              source={source}
              width="25px"
            />
          ) : (
            <NameAvatar name={postProvider} />
          )}
          <View ml={2}>
            <Title>{postProvider}</Title>
          </View>
        </View>
        <HTMLText mb={1} numberOfLines={0} size={14}>
          {html}
        </HTMLText>
        {item.thumbnail && isValidURL(item.thumbnail) && (
          <ProgressImage
            height={SCREEN_WIDTH / 2}
            mt={1}
            source={{uri: item.thumbnail}}
          />
        )}
        <View alignItems="center" flexDirection="row" mt={2}>
          <Title>NEWS</Title>
          <View backgroundColor="black.900" mx={2} rounded="full" size={1} />
          <SubTitle fontSize="xs">{timeDiffCalc(item.pubDate)}</SubTitle>
        </View>
        <Reactions
          commentCount={item.commentsCount}
          isLiked={item.isLiked}
          likeCount={item.likesCount}
          mt={2}
          theme={theme}
          onComment={onItemPress}
          onLike={onItemPress}
        />
        <View borderBottomColor="gray.500" borderBottomWidth={1} mt={2} />
      </View>
    </SafeTouchable>
  );
}

NewsProviderPostView.defaultProps = {
  onSelect: undefined,
};

export const NewsProviderPostItem = React.memo(NewsProviderPostView);

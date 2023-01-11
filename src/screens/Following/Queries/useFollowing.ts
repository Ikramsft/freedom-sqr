/**
 * @format
 */
import {useCallback} from 'react';
import {useInfiniteQuery} from 'react-query';

import client from 'api';

import {config} from '../../../config';
import {QueryKeys} from '../../../utils/QueryKeys';

export interface INewsProvider {
  documentID: string;
  logo: string;
  name: string;
  rss: string;
  slug: string;
  thumbnail: string;
  url: string;
}

export interface IAudioMedia {
  url: string;
  type: string;
  secure_url: string;
}

export interface IImagesMedia {
  url: string;
  type: string;
  width: number;
  height: number;
  secure_url: string;
}

export interface IShortNews {
  description: string;
  documentId: string;
  isFeatured: boolean;
  postId: string;
  postProvider: string;
  postedAt: string;
  providerUrl: string;
  thumbnail: string;
  title: string;
  type: string;
}

export interface INewsData {
  author: string;
  category: string;
  comments: string | null;
  commentsCount: number;
  content: string;
  desc: string;
  documentID: string;
  featuredAt: string;
  guid: string;
  isFeatured: boolean;
  isLiked: boolean;
  likesCount: number;
  link: string;
  mediaContent: {
    url: string;
    type: string;
    title: string;
    audios: IAudioMedia[];
    images: IImagesMedia[];
    locale: string;
    videos: string | null;
    article: {
      tags: string | null;
      authors: string | null;
      section: string;
      modified_time: string | null;
      published_time: string | null;
      expiration_time: string | null;
    };
    site_name: string;
    determiner: string;
    description: string;
    locales_alternate: string | null;
  };
  provider: INewsProvider;
  providerID: string;
  pubDate: string;
  thumbnail: string;
  title: string;
  updateDate: string;
}
export interface IResponseData {
  data: IShortNews[];
  error: boolean;
  message: string;
  status: number;
}

export interface INewsDataPage {
  data: IShortNews[];
  pageNo: number;
  hasNext: boolean;
}

export interface IResourceData {
  documentID: string;
  thumbnail: string;
  title: string;
  url: string;
}

const PER_PAGE = 15;

async function fetchFollowing(
  pageNo: number,
): Promise<INewsDataPage | undefined> {
  try {
    const offset = (pageNo - 1) * PER_PAGE;
    const url = `${config.TIMELINE_API_URL}/timeline/following?offset=${offset}&limit=${PER_PAGE}`;
    const response: IResponseData = await client.get(url);
    if (response.data.length > 0 && !response.error) {
      return {
        data: response.data,
        pageNo,
        hasNext: response.data.length >= PER_PAGE,
      };
    }
    return {data: [], pageNo, hasNext: false};
  } catch (error) {
    return Promise.reject(error);
  }
}

const useFollowing = () => {
  const cacheKey = [QueryKeys.following];
  const listQuery = useInfiniteQuery(
    cacheKey,
    ({pageParam = 1}) => fetchFollowing(pageParam),
    {
      getNextPageParam: lastPage => {
        return lastPage?.hasNext ? lastPage.pageNo + 1 : null;
      },
    },
  );

  const {data, fetchNextPage, hasNextPage, isFetchingNextPage} = listQuery;

  const newsList: IShortNews[] = [];

  const onEndReached = useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (data) {
    data.pages.forEach(page => {
      if (page?.data) {
        newsList.push(...page.data);
      }
    });
  }

  return {
    ...listQuery,
    newsList,
    onEndReached,
  };
};

export {useFollowing};

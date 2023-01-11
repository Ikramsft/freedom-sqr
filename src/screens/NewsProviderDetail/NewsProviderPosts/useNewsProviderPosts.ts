/**
 * @format
 */
import {useCallback} from 'react';
import {useInfiniteQuery} from 'react-query';

import client from 'api';

import {config} from '../../../config';
import {QueryKeys} from '../../../utils/QueryKeys';
import {IRequestMeta} from '../../../constants/types';
import {RECORD_PER_PAGE} from '../../../constants';
import {INewsProviderPost} from './NewsProviderPostItem/index';

export interface IResponseData extends IRequestMeta {
  data: INewsProviderPost[];
  providerID: string;
}

export interface INewsProviderPostPage {
  data: INewsProviderPost[];
  pageNo: number;
  hasNext: boolean;
}

async function fetchNewsProviderPosts(
  providerID: string,
  pageNo: number,
): Promise<INewsProviderPostPage | undefined> {
  try {
    const offset = (pageNo - 1) * RECORD_PER_PAGE;
    const url = `${config.NEWS_API_URL}/providers/${providerID}/news?limit=${RECORD_PER_PAGE}&offset=${offset}`;
    const response: IResponseData = await client.get(url);
    if (response.data.length > 0 && !response.error) {
      const data = response.data ?? [];
      const hasNext = data.length >= RECORD_PER_PAGE;
      return {data, pageNo, hasNext};
    }
    return {data: [], pageNo, hasNext: false};
  } catch (error) {
    return Promise.reject(error);
  }
}

const useNewsProviderPosts = (providerID = '') => {
  const cacheKey = [QueryKeys.newsList, providerID];

  const listQuery = useInfiniteQuery(
    cacheKey,
    ({pageParam = 1}) => fetchNewsProviderPosts(providerID, pageParam),
    {
      getNextPageParam: lastPage => {
        return lastPage?.hasNext ? lastPage.pageNo + 1 : null;
      },
      enabled: providerID !== '',
    },
  );

  const {data, fetchNextPage, hasNextPage, isFetchingNextPage} = listQuery;

  const newsList: INewsProviderPost[] = [];

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

export {useNewsProviderPosts};

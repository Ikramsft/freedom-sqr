/**
 * @format
 */
import {useCallback} from 'react';
import {useInfiniteQuery} from 'react-query';
import {isArray} from 'lodash';

import client from 'api';

import {config} from '../../../config';
import {QueryKeys} from '../../../utils/QueryKeys';
import {IRequestMeta} from '../../../constants/types';
import {RECORD_PER_PAGE} from '../../../constants';
import {IBusinessPost} from './BusinessPostItem/index';

export interface IResponseData extends IRequestMeta {
  data: IBusinessPost[];
}

export interface IBusinessPostPage {
  data: IBusinessPost[];
  pageNo: number;
  hasNext: boolean;
}

async function fetchBusinessPosts(
  businessId: string,
  pageNo: number,
): Promise<IBusinessPostPage | undefined> {
  try {
    const offset = (pageNo - 1) * RECORD_PER_PAGE;
    const url = `${config.BUSINESS_API_URL}/${businessId}/content?limit=${RECORD_PER_PAGE}&offset=${offset}`;
    const response: IResponseData = await client.get(url);
    if (isArray(response.data) && response.data.length > 0 && !response.error) {
      const data = response.data ?? [];
      const hasNext = data.length >= RECORD_PER_PAGE;
      return {data, pageNo, hasNext};
    }
    return {data: [], pageNo, hasNext: false};
  } catch (error) {
    return Promise.reject(error);
  }
}

const useBusinessPosts = (businessId = '') => {
  const cacheKey = [QueryKeys.businessPosts, businessId];

  const listQuery = useInfiniteQuery(
    cacheKey,
    ({pageParam = 1}) => fetchBusinessPosts(businessId, pageParam),
    {
      getNextPageParam: lastPage => {
        return lastPage?.hasNext ? lastPage.pageNo + 1 : null;
      },
      enabled: businessId !== '',
    },
  );

  const {data, fetchNextPage, hasNextPage, isFetchingNextPage} = listQuery;

  const list: IBusinessPost[] = [];

  const onEndReached = useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (data) {
    data.pages.forEach(page => {
      if (page?.data) {
        list.push(...page.data);
      }
    });
  }

  return {
    ...listQuery,
    list,
    onEndReached,
  };
};

export {useBusinessPosts};

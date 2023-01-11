/**
 * @format
 */
import React from 'react';
import {useInfiniteQuery} from 'react-query';

import client from 'api';

import {config} from '../../../../config';
import {IRequestMeta} from '../../../../constants';
import {QueryKeys} from '../../../../utils/QueryKeys';
import {IBusinessItem} from '../../../BusinessTab/Queries/useBusinessTab';

export interface IResponseData extends IRequestMeta {
  data: IBusinessItem[];
  error: boolean;
  message: string;
  status: number;
}
export interface IBusinessPage {
  data: IBusinessItem[];
  pageNo: number;
  hasNext: boolean;
}

const RECORD_PER_PAGE = 20;

async function fetchBusiness(
  pageNo: number,
  query: string,
): Promise<IBusinessPage> {
  try {
    const offset = (pageNo - 1) * RECORD_PER_PAGE;
    let url = '';
    if (query) {
      url = `${config.BUSINESS_TAB_URL}/business/search?q=${query}&page=${pageNo}&limit=${RECORD_PER_PAGE}&p=prefs`;
    } else {
      url = `${config.BUSINESS_TAB_URL}/businesses?type=all&limit=${RECORD_PER_PAGE}&offset=${offset}&p=prefs`;
    }
    const response: IResponseData = await client.get(url);
    if (response.data.length > 0 && !response.error) {
      return {
        data: response.data,
        pageNo,
        hasNext: response.data.length >= RECORD_PER_PAGE,
      };
    }
    return {data: [], pageNo, hasNext: false};
  } catch (error) {
    return Promise.reject(error);
  }
}

const useBusiness = (query: string) => {
  const cacheKey = [QueryKeys.preferenceBusinessList, query];

  const listQuery = useInfiniteQuery(
    cacheKey,
    ({pageParam = 1}) => fetchBusiness(pageParam, query),
    {
      getNextPageParam: lastPage => {
        return lastPage?.hasNext ? lastPage.pageNo + 1 : null;
      },
    },
  );

  const {data, fetchNextPage, hasNextPage, isFetchingNextPage} = listQuery;

  const list: IBusinessItem[] = [];

  const onEndReached = React.useCallback(() => {
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

export {useBusiness};

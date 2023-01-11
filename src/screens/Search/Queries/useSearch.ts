import {isString} from 'lodash';
import {useCallback} from 'react';
import {useInfiniteQuery} from 'react-query';

import client from 'api';

import {config} from '../../../config';
import {QueryKeys} from '../../../utils/QueryKeys';
import {IShortNews} from '../../Following/Queries/useFollowing';

export interface IResponseData {
  data: [];
  error: boolean;
  message: string;
  status: number;
}

export interface ISearchPage {
  data: IShortNews[];
  totalCount: number;
  page: number;
  hasNext: boolean;
}

const PER_PAGE = 10;

async function fetchSearchResults(
  searchText: string,
  page: number,
): Promise<ISearchPage | undefined> {
  try {
    const url = `${config.TIMELINE_API_URL}/timeline/search`;
    const params = {q: searchText, page, limit: PER_PAGE};
    if (searchText && isString(searchText) && searchText.length < 3) {
      return {
        data: [],
        totalCount: 0,
        page,
        hasNext: false,
      };
    }
    const response: IResponseData = await client.get(url, {params});

    const hasNext = response.data.length >= PER_PAGE;

    return {
      data: response.data,
      totalCount: response.data.length,
      page: page + 1,
      hasNext,
    };
  } catch (error: any) {
    return Promise.reject(error);
  }
}

const useSearch = (searchText: string) => {
  const cacheKey = [QueryKeys.searchAll, searchText];
  const listQuery = useInfiniteQuery(
    cacheKey,
    ({pageParam = 1}) => fetchSearchResults(searchText, pageParam),
    {
      getNextPageParam: lastPage => {
        return lastPage?.hasNext ? lastPage.page : null;
      },
      enabled: searchText.length >= 3,
    },
  );

  const {data, fetchNextPage, hasNextPage, isFetchingNextPage} = listQuery;

  const searchResult: IShortNews[] = [];

  const onEndReached = useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (data) {
    data.pages.forEach(page => {
      if (page?.data) {
        searchResult.push(...page.data);
      }
    });
  }

  return {
    ...listQuery,
    searchResult,
    onEndReached,
  };
};

export {useSearch};

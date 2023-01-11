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

export interface IMedia {
  contentId: string;
  imageId: string;
  imageUrl: string;
}

export interface IResponseData extends IRequestMeta {
  data: {
    postImages: IMedia[];
  };
}

export interface IBusinessPostPage {
  data: IMedia[];
  pageNo: number;
  hasNext: boolean;
}

async function fetchBusinessMedia(
  businessId: string,
  pageNo: number,
): Promise<IBusinessPostPage | undefined> {
  try {
    const offset = (pageNo - 1) * RECORD_PER_PAGE;
    const url = `${config.BUSINESS_API_URL}/business/${businessId}/image?limit=${RECORD_PER_PAGE}&offset=${offset}`;
    const response: IResponseData = await client.get(url);
    if (response.data.postImages.length > 0 && !response.error) {
      const data = response.data.postImages ?? [];
      const hasNext = data.length >= RECORD_PER_PAGE;
      return {data, pageNo, hasNext};
    }
    return {data: [], pageNo, hasNext: false};
  } catch (error) {
    return Promise.reject(error);
  }
}

const useBusinessMedia = (businessId = '') => {
  const cacheKey = [QueryKeys.businessMedia, businessId];

  const listQuery = useInfiniteQuery(
    cacheKey,
    ({pageParam = 1}) => fetchBusinessMedia(businessId, pageParam),
    {
      getNextPageParam: lastPage => {
        return lastPage?.hasNext ? lastPage.pageNo + 1 : null;
      },
      enabled: businessId !== '',
    },
  );

  const {data, fetchNextPage, hasNextPage, isFetchingNextPage} = listQuery;

  const list: IMedia[] = [];

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

export {useBusinessMedia};

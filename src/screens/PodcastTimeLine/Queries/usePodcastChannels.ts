/**
 * @format
 */
import {useInfiniteQuery} from 'react-query';
import {useCallback} from 'react';

import client from 'api';

import {config} from '../../../config';
import {QueryKeys} from '../../../utils/QueryKeys';
import {IRequestMeta} from '../../../constants/types';
import {RECORD_PER_PAGE} from '../../../constants';

export interface IPodcastsTimelineData {
  documentId: string;
  images: string;
  name: string;
  showDescription: string;
  isFollowed: boolean;
}

export interface IResponseData extends IRequestMeta {
  data: IPodcastsTimelineData[];
  error: boolean;
  message: string;
  status: number;
}

export interface IPodcastsTimelinePage {
  data: IPodcastsTimelineData[];
  pageNo: number;
  hasNext: boolean;
}

async function fetchPodcastsTimeline(
  pageNo: number,
): Promise<IPodcastsTimelinePage | undefined> {
  try {
    const url = `${config.PODCASTS_API_URL}/podcasts?limit=${RECORD_PER_PAGE}&offset=${pageNo}`;
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

const usePodcastsTimeline = () => {
  const cacheKey = [QueryKeys.allPodcastsList];
  const listQuery = useInfiniteQuery(
    cacheKey,
    ({pageParam = 1}) => fetchPodcastsTimeline(pageParam),
    {
      getNextPageParam: lastPage => {
        return lastPage?.hasNext ? lastPage.pageNo + 1 : null;
      },
    },
  );

  const {data, fetchNextPage, hasNextPage, isFetchingNextPage} = listQuery;

  const allPodcastsList: IPodcastsTimelineData[] = [];

  const onEndReached = useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (data) {
    data.pages.forEach(page => {
      if (page?.data) {
        allPodcastsList.push(...page.data);
      }
    });
  }

  return {
    ...listQuery,
    allPodcastsList,
    onEndReached,
  };
};

export {usePodcastsTimeline};

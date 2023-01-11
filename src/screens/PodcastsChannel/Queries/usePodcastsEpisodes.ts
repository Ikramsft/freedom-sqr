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

export interface IPodcastImage {
  height: number;
  width: number;
  url: string;
}

export interface IPodcastEpisode {
  audioPreview: string;
  type?: string;
  audioUrl: string;
  commentCount: number;
  episodeDescription: string;
  episodeDurationMs: string;
  episodeID: string;
  episodeName: string;
  externalCreatedAt: string;
  externalID: string;
  images: string;
  externalShowImages: string;
  likeCount: number;
  podcastShowID: string;
  podcastShowName: string;
  podcastShowType: string;
  thumbnail: string;
  podcastShowUrl: string;
  isLiked: boolean;
  isFollowed: boolean;
  url: string;
}

export interface IResponseData extends IRequestMeta {
  data: IPodcastEpisode[];
  error: boolean;
  message: string;
  status: number;
}

export interface IPodcastEpisodePage {
  data: IPodcastEpisode[];
  pageNo: number;
  hasNext: boolean;
}

async function fetchPodcastsChannel(
  pageNo: number,
  documentId: string,
): Promise<IPodcastEpisodePage | undefined> {
  try {
    const url = `${config.PODCASTS_API_URL}/podcasts/${documentId}/episodes?limit=${RECORD_PER_PAGE}&offset=${pageNo}`;
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

const usePodcastsEpisodes = (documentId: string) => {
  const cacheKey = [QueryKeys.podcastsEpisodeList, documentId];
  const listQuery = useInfiniteQuery(
    cacheKey,
    ({pageParam = 1}) => fetchPodcastsChannel(pageParam, documentId),
    {
      getNextPageParam: lastPage => {
        return lastPage?.hasNext ? lastPage.pageNo + 1 : null;
      },
    },
  );

  const {data, fetchNextPage, hasNextPage, isFetchingNextPage} = listQuery;

  const podcastsEpisodeList: IPodcastEpisode[] = [];

  const onEndReached = useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (data) {
    data.pages.forEach(page => {
      if (page?.data) {
        podcastsEpisodeList.push(...page.data);
      }
    });
  }

  return {
    ...listQuery,
    podcastsEpisodeList,
    onEndReached,
  };
};

export {usePodcastsEpisodes};

/**
 * @format
 */
import {useInfiniteQuery} from 'react-query';
import {useCallback, useEffect} from 'react';
import client from 'api';
import {config} from '../../../config';
import {QueryKeys} from '../../../utils/QueryKeys';
import {IRequestMeta} from '../../../constants/types';
import {RECORD_PER_PAGE, StorageKeys} from '../../../constants';
import {IPodcastEpisode} from '../../PodcastsChannel/Queries/usePodcastsEpisodes';
import {useTrackAdv} from '../../../hooks/useAds';
import {useAdvertisement} from '../../../redux/advertisements';

export interface IResponseData extends IRequestMeta {
  data: IPodcastEpisode[];
  error: boolean;
  message: string;
  status: number;
}

export interface IPodcastsTimelinePage {
  data: IPodcastEpisode[];
  pageNo: number;
  hasNext: boolean;
}

async function fetchPodcastsTimeline(
  pageNo: number,
): Promise<IPodcastsTimelinePage | undefined> {
  try {
    const offset = (pageNo - 1) * RECORD_PER_PAGE;
    const url = `${config.PODCASTS_API_URL}/podcasts/episodes?limit=${RECORD_PER_PAGE}&offset=${offset}&includeFeatured=false`;
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
  const cacheKey = [QueryKeys.allPodcastTimeline];
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

  const allPodcastsList: IPodcastEpisode[] = [];

  const {pushPodCastAdv} = useAdvertisement();
  const {
    getAdvertisement,
    setAdvertisementInStorage,
    getAdvertisementStorageInfo,
  } = useTrackAdv();

  const initialSequence = 'MC=0';

  const fetchAds = async () => {
    for (let i = 0; i < 2; i += 1) {
      const current = getAdvertisementStorageInfo(
        StorageKeys.CURRENT_D_SEQUENCE,
      );
      const positionSequence = current ?? initialSequence;
      // eslint-disable-next-line no-await-in-loop
      const response = await getAdvertisement({
        page: 'podcasts',
        type: positionSequence,
      });
      if (response && response.length > 0) {
        pushPodCastAdv(response[0]);
        setAdvertisementInStorage(
          StorageKeys.CURRENT_D_SEQUENCE,
          response[0]?.currentSequence,
        );
      }
    }
  };

  useEffect(() => {
    fetchAds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onEndReached = useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
      fetchAds();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

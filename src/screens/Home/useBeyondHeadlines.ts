/**
 * @format
 */
import {useCallback, useEffect} from 'react';
import {useInfiniteQuery} from 'react-query';
import client from 'api';
import {config} from '../../config';
import {QueryKeys} from '../../utils/QueryKeys';
import {IRequestMeta} from '../../constants/types';
import {IShortNews} from '../News/Queries/useNewsFeed';
import {RECORD_PER_PAGE, StorageKeys} from '../../constants';
import {useAdvertisement} from '../../redux/advertisements';
import {useTrackAdv} from '../../hooks/useAds';

export interface IResponseData extends IRequestMeta {
  data: IShortNews[];
}

export interface ITimelinePage {
  data: IShortNews[];
  pageNo: number;
  hasNext: boolean;
}

async function fetchNewsList(
  pageNo: number,
): Promise<ITimelinePage | undefined> {
  try {
    const offset = (pageNo - 1) * RECORD_PER_PAGE;
    const url = `${config.TIMELINE_API_URL}/timeline/posts?isFeatured=false&limit=${RECORD_PER_PAGE}&offset=${offset}`;
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

const useBeyondHeadlines = () => {
  const cacheKey = [QueryKeys.beyondHeadlines];
  const listQuery = useInfiniteQuery(
    cacheKey,
    ({pageParam = 1}) => fetchNewsList(pageParam),
    {
      getNextPageParam: lastPage => {
        return lastPage?.hasNext ? lastPage.pageNo + 1 : null;
      },
    },
  );

  const {pushCurrentSequence, pushHomeViewAllAdv} = useAdvertisement();
  const {
    getAdvertisement,
    setAdvertisementInStorage,
    getAdvertisementStorageInfo,
  } = useTrackAdv();
  const {data, fetchNextPage, hasNextPage, isFetchingNextPage} = listQuery;

  const list: IShortNews[] = [];

  const initialSequence = 'MC=0';

  const fetchAds = async () => {
    for (let i = 0; i < 2; i += 1) {
      const current = getAdvertisementStorageInfo(
        StorageKeys.CURRENT_D_SEQUENCE,
      );
      const positionSequence = current || initialSequence;
      // eslint-disable-next-line no-await-in-loop
      const response = await getAdvertisement({
        page: 'home',
        type: positionSequence,
      });
      if (response && response.length > 0) {
        pushHomeViewAllAdv(response[0]);
        setAdvertisementInStorage(
          StorageKeys.CURRENT_D_SEQUENCE,
          response[0]?.currentSequence,
        );
        pushCurrentSequence(response[0]?.sequence);
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

export {useBeyondHeadlines};

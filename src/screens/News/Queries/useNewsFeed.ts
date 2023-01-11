/**
 * @format
 */
import {useCallback, useEffect} from 'react';
import {useInfiniteQuery} from 'react-query';
import client from 'api';
import {config} from '../../../config';
import {QueryKeys} from '../../../utils/QueryKeys';
import {RECORD_PER_PAGE, StorageKeys} from '../../../constants';
import {useTrackAdv} from '../../../hooks/useAds';
import {useAdvertisement} from '../../../redux/advertisements';

export interface INewsProvider {
  documentID: string;
  logo: string;
  name: string;
  rss: string;
  slug: string;
  thumbnail: string;
  url: string;
  isFollowed: boolean;
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
  postProviderId: string;
  postProviderLogo: string;
  postedAt: string;
  providerUrl: string;
  thumbnail: string;
  title: string;
  type: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  url?: string;
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
  type: string;
  url: string;
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
  data: INewsData[];
  error: boolean;
  message: string;
  status: number;
}

export interface INewsDataPage {
  data: INewsData[];
  pageNo: number;
  hasNext: boolean;
}

export interface IResourceData {
  documentID: string;
  imageUrl: string;
  resourceName: string;
  resourceViewUrl: string;
}

async function fetchNewsList(
  pageNo: number,
): Promise<INewsDataPage | undefined> {
  try {
    const url = `${config.NEWS_API_URL}/news?news_in=detail&page=${pageNo}&limit=${RECORD_PER_PAGE}`;
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

const useNewsList = () => {
  const cacheKey = [QueryKeys.newsList];
  const listQuery = useInfiniteQuery(
    cacheKey,
    ({pageParam = 1}) => fetchNewsList(pageParam),
    {
      getNextPageParam: lastPage => {
        return lastPage?.hasNext ? lastPage.pageNo + 1 : null;
      },
    },
  );

  const {data, fetchNextPage, hasNextPage, isFetchingNextPage} = listQuery;

  const {pushNewsAdv} = useAdvertisement();
  const {
    getAdvertisement,
    setAdvertisementInStorage,
    getAdvertisementStorageInfo,
  } = useTrackAdv();

  const newsList: INewsData[] = [];

  const initialSequence = 'MC=0';

  const fetchAds = async () => {
    for (let i = 0; i < 2; i += 1) {
      const current = getAdvertisementStorageInfo(
        StorageKeys.CURRENT_D_SEQUENCE,
      );
      const positionSequence = current ?? initialSequence;
      // eslint-disable-next-line no-await-in-loop
      const response = await getAdvertisement({
        page: 'news',
        type: positionSequence,
      });
      if (response && response.length > 0) {
        pushNewsAdv(response[0]);
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

export {useNewsList};

/**
 * @format
 */
import {useCallback} from 'react';
import {useInfiniteQuery} from 'react-query';

import client from 'api';

import {config} from '../../../config';
import {QueryKeys} from '../../../utils/QueryKeys';
import {IResourceData} from '../../News/Queries/useNewsFeed';

export interface IResourceProvider {
  documentID: string;
  logo: string;
  name: string;
  rss: string;
  slug: string;
  thumbnail: string;
  url: string;
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

export interface IShortResource {
  description: string;
  documentId: string;
  isFeatured: boolean;
  postId: string;
  postProvider: string;
  postedAt: string;
  providerUrl: string;
  thumbnail: string;
  title: string;
  type: string;
}

export interface IResponseData {
  data: IResourceData[];
  error: boolean;
  message: string;
  status: number;
}

export interface IResourceDataPage {
  data: IResourceData[];
  pageNo: number;
  hasNext: boolean;
}
const PER_PAGE = 12;

async function fetchResourceList(
  pageNo: number,
): Promise<IResourceDataPage | undefined> {
  try {
    const url = `${config.RESOURCE_API_URL}/resources?page=${pageNo}&limit=${PER_PAGE}`;
    const response: IResponseData = await client.get(url);
    if (response.data.length > 0 && !response.error) {
      return {
        data: response.data,
        pageNo,
        hasNext: response.data.length >= PER_PAGE,
      };
    }
    return {data: [], pageNo, hasNext: false};
  } catch (error) {
    return Promise.reject(error);
  }
}

const useResourceList = () => {
  const cacheKey = [QueryKeys.resourceList];
  const listQuery = useInfiniteQuery(
    cacheKey,
    ({pageParam = 1}) => fetchResourceList(pageParam),
    {
      getNextPageParam: lastPage => {
        return lastPage?.hasNext ? lastPage.pageNo + 1 : null;
      },
    },
  );

  const {data, fetchNextPage, hasNextPage, isFetchingNextPage} = listQuery;

  const resourceList: IResourceData[] = [];

  const onEndReached = useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (data) {
    data.pages.forEach(page => {
      if (page?.data) {
        resourceList.push(...page.data);
      }
    });
  }

  return {
    ...listQuery,
    resourceList,
    onEndReached,
  };
};

export {useResourceList};

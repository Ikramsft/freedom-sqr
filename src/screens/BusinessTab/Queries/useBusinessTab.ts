/**
 * @format
 */
import {useInfiniteQuery} from 'react-query';
import {useCallback} from 'react';
import client from 'api';
import {config} from '../../../config';
import {QueryKeys} from '../../../utils/QueryKeys';
import {IRequestMeta} from '../../../constants/types';
import {RECORD_PER_PAGE} from '../../../constants/common';

type Tab = 'isFeatured' | 'recent' | 'all';

export interface IImages {
  croppedImageDetails: string;
  croppedImageReadUrl: string;
  documentId: string;
  imageType: string;
  originalImageReadUrl: string;
}
export interface IBusinessItem {
  description: string;
  documentId: string;
  imageLogo: IImages;
  name: string;
  isFollowing: boolean;
  role: string;
}

export interface IResponseData extends IRequestMeta {
  data: IBusinessItem[];
  error: boolean;
  message: string;
  status: number;
}

export interface IBusinessTabDataPage {
  data: IBusinessItem[];
  pageNo: number;
  hasNext: boolean;
}

async function fetchBusinessTab(
  pageNo: number,
  type: Tab,
): Promise<IBusinessTabDataPage | undefined> {
  try {
    let url = `${config.BUSINESS_TAB_URL}/businesses?limit=${RECORD_PER_PAGE}&offset=${pageNo}`;
    switch (type) {
      case 'all':
        url += `&isFeatured=false&type=all`;
        break;
      case 'recent':
        url += `&isFeatured=false&type=recent`;
        break;
      case 'isFeatured':
        url += `&isFeatured=true&type=all`;
        break;
      default:
        break;
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

const useBusinessTab = (type: Tab) => {
  const cacheKey = [QueryKeys.BusinessTabList];
  const listQuery = useInfiniteQuery(
    cacheKey,
    ({pageParam = 1}) => fetchBusinessTab(pageParam, type),
    {
      getNextPageParam: lastPage => {
        return lastPage?.hasNext ? lastPage.pageNo + 1 : null;
      },
    },
  );

  const {data, fetchNextPage, hasNextPage, isFetchingNextPage} = listQuery;

  const businessList: IBusinessItem[] = [];

  const onEndReached = useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (data) {
    data.pages.forEach(page => {
      if (page?.data) {
        businessList.push(...page.data);
      }
    });
  }

  return {
    ...listQuery,
    businessList,
    onEndReached,
  };
};

export {useBusinessTab};

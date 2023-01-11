/**
 * @format
 */
import {useCallback} from 'react';
import {useInfiniteQuery} from 'react-query';
import {isArray} from 'lodash';

import client from 'api';

import {config} from '../../config';
import {QueryKeys} from '../../utils/QueryKeys';
import {IRequestMeta} from '../../constants/types';
import {COMMENTS_PER_PAGE} from '../../constants';

export interface User {
  userId: string;
  userName: string;
  croppedImageReadUrl: string;
  influencerStatus: boolean;
}

export interface ISingleComment {
  documentID: string;
  contentId: string;
  userId: string;
  user: User;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IResponseData extends IRequestMeta {
  data: ISingleComment[];
}

export interface ITimelinePage {
  data: ISingleComment[];
  pageNo: number;
  hasNext: boolean;
}

async function fetchSingleComments(
  postId: string,
  pageNo: number,
): Promise<ITimelinePage | undefined> {
  try {
    const offset = (pageNo - 1) * COMMENTS_PER_PAGE;
    const url = `${config.BUSINESS_API_URL}/content/${postId}/comment?limit=${COMMENTS_PER_PAGE}&offset=${offset}`;
    const response: IResponseData = await client.get(url);

    if (isArray(response.data) && response.data.length > 0 && !response.error) {
      return {
        data: response.data,
        pageNo,
        hasNext: response.data.length >= COMMENTS_PER_PAGE,
      };
    }
    return {data: [], pageNo, hasNext: false};
  } catch (error) {
    return Promise.reject(error);
  }
}

const useSingleComments = (postId: string, enabled: boolean) => {
  const cacheKey = [QueryKeys.singlePostComments, postId];

  const listQuery = useInfiniteQuery(
    cacheKey,
    ({pageParam = 1}) => fetchSingleComments(postId, pageParam),
    {
      getNextPageParam: lastPage => {
        return lastPage?.hasNext ? lastPage.pageNo + 1 : null;
      },
      enabled: postId !== '' && enabled,
    },
  );

  const {data, fetchNextPage, hasNextPage, isFetchingNextPage} = listQuery;
  const list: ISingleComment[] = [];

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

export {useSingleComments};

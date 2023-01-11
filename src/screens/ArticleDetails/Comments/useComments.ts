/**
 * @format
 */
import {useCallback} from 'react';
import {useInfiniteQuery} from 'react-query';

import client from 'api';

import {config} from '../../../config';
import {QueryKeys} from '../../../utils/QueryKeys';
import {IRequestMeta} from '../../../constants/types';
import {IComment} from './CommentItem';
import {COMMENTS_PER_PAGE} from '../../../constants';

export interface IResponseData extends IRequestMeta {
  data: IComment[];
}

export interface ITimelinePage {
  data: IComment[];
  pageNo: number;
  hasNext: boolean;
}

async function fetchComments(
  articleId: string,
  pageNo: number,
): Promise<ITimelinePage | undefined> {
  try {
    const offset = (pageNo - 1) * COMMENTS_PER_PAGE;
    const url = `${config.NEWS_API_URL}/users/news/${articleId}/comments?limit=${COMMENTS_PER_PAGE}&offset=${offset}`;
    const response: IResponseData = await client.get(url);
    if (response.data.length > 0 && !response.error) {
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

const useComments = (articleId = '') => {
  const cacheKey = [QueryKeys.commentList, articleId];

  const listQuery = useInfiniteQuery(
    cacheKey,
    ({pageParam = 1}) => fetchComments(articleId, pageParam),
    {
      getNextPageParam: lastPage => {
        return lastPage?.hasNext ? lastPage.pageNo + 1 : null;
      },
      enabled: articleId !== '',
    },
  );

  const {data, fetchNextPage, hasNextPage, isFetchingNextPage} = listQuery;

  const list: IComment[] = [];

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

export {useComments};

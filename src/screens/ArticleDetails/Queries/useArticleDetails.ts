/**
 * @format
 */
import {useQuery} from 'react-query';

import client from 'api';

import {config} from '../../../config';
import {QueryKeys} from '../../../utils/QueryKeys';
import {IRequestMeta} from '../../../constants/types';
import {INewsData} from '../../News/Queries/useNewsFeed';

export interface IResponseData extends IRequestMeta {
  data: INewsData[];
}

async function fetchArticleDetails(
  articleId: string,
): Promise<INewsData | undefined> {
  try {
    const url = `${config.NEWS_API_URL}/news/${articleId}/article`;
    const response: IResponseData = await client.get(url);
    return response.data[0];
  } catch (error: any) {
    return undefined;
  }
}

const useArticleDetails = (articleId: string) => {
  const cacheKey = [QueryKeys.articleDetails, articleId];
  return useQuery(cacheKey, () => fetchArticleDetails(articleId));
};

export {useArticleDetails};

/**
 * @format
 */
import {useQueryClient} from 'react-query';

import client from 'api';

import {config} from '../../../config';
import {QueryKeys} from '../../../utils/QueryKeys';
import {showSnackbar} from '../../../utils/SnackBar';
import {ISinglePost} from '../../BusinessSinglePost/useBusinessSinglePost';
import {INewsData, INewsDataPage} from '../../News/Queries/useNewsFeed';

export type likeFrom = 'home' | 'article_detail' | 'news' | 'timeline' | '';
export interface IResponseData {
  data: INewsData[];
  error: boolean;
  message: string;
  status: number;
}

interface INewsDataPageCache {
  pages: INewsDataPage[];
  pageParams: [];
}

async function articleLike(
  documentID: string,
): Promise<number | undefined | null> {
  try {
    const url = `${config.NEWS_API_URL}/users/news/${documentID}/like`;
    const response: IResponseData = await client.post(url);
    if (!response.error) {
      return response.status;
    }
    return null;
  } catch (error) {
    return Promise.reject(error);
  }
}

async function articleDisLike(
  documentID: string,
): Promise<number | undefined | null> {
  try {
    const url = `${config.NEWS_API_URL}/users/news/${documentID}/like`;
    const response: IResponseData = await client.delete(url);
    if (!response.error) {
      return response.status;
    }
    return null;
  } catch (error) {
    return Promise.reject(error);
  }
}

const useArticleActions = () => {
  const queryClient = useQueryClient();

  const updateArticleTimelineCache = async (
    documentID: string,
    key: string[],
    isLike: boolean,
  ) => {
    const articles = await queryClient.getQueryData<INewsDataPageCache>(key);
    if (articles) {
      const {pages} = articles;
      const updatedPages = pages.map((c: INewsDataPage) => {
        const {data: posts, ...rest} = c;
        const updatedArticles = posts.map((article: INewsData) => {
          if (article.documentID === documentID) {
            return {
              ...article,
              likesCount: isLike
                ? article.likesCount + 1
                : article.likesCount - 1,
              isLiked: isLike,
            };
          }
          return article;
        });
        return {...rest, data: updatedArticles};
      });
      const updateArticles = {...articles, pages: updatedPages};
      queryClient.setQueryData<INewsDataPageCache>(key, {
        ...updateArticles,
      });
    }
  };

  const updateArticleSinglePostCache = async (
    documentID: string,
    isLike: boolean,
  ) => {
    const cacheKey = [QueryKeys.articleDetails, documentID];
    const article = await queryClient.getQueryData<ISinglePost>(cacheKey);
    if (article) {
      await queryClient.setQueryData<ISinglePost>(cacheKey, {
        ...article,
        likesCount: isLike ? article.likesCount + 1 : article.likesCount - 1,
        isLiked: isLike,
      });
    }
  };

  const articleLikeToggle = async (
    documentID: string,
    from: likeFrom,
    isLike: boolean,
    providerId?: string,
  ) => {
    try {
      let status;
      switch (from) {
        case 'article_detail':
        case 'timeline':
          if (isLike) {
            status = await articleLike(documentID);
          } else {
            status = await articleDisLike(documentID);
          }
          break;
        default:
          break;
      }
      if (status === 200) {
        switch (from) {
          case 'home':
            break;
          case 'article_detail':
            updateArticleTimelineCache(
              documentID,
              [QueryKeys.beyondHeadlines],
              isLike,
            );
            updateArticleTimelineCache(
              documentID,
              [QueryKeys.newsList],
              isLike,
            );
            updateArticleSinglePostCache(documentID, isLike);
            await queryClient.invalidateQueries([
              QueryKeys.businessDetails,
              documentID,
            ]);
            if (providerId) {
              updateArticleTimelineCache(
                documentID,
                [QueryKeys.newsList, providerId],
                isLike,
              );
              await queryClient.invalidateQueries([
                QueryKeys.newsList,
                providerId,
              ]);
            }
            break;
          case 'timeline':
          case 'news':
            updateArticleTimelineCache(
              documentID,
              [QueryKeys.beyondHeadlines],
              isLike,
            );
            updateArticleTimelineCache(
              documentID,
              [QueryKeys.newsList],
              isLike,
            );
            await queryClient.invalidateQueries([
              QueryKeys.businessDetails,
              documentID,
            ]);
            break;

          default:
            break;
        }
      }
    } catch (error: any) {
      const message = error.message ?? 'Something went wrong';
      showSnackbar({message, type: 'error'});
    }
  };
  return {
    articleLikeToggle,
  };
};

export {useArticleActions};

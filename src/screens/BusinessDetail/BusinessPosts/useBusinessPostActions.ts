/**
 * @format
 */
import {useQueryClient} from 'react-query';

import client from 'api';

import {config} from '../../../config';
import {QueryKeys} from '../../../utils/QueryKeys';
import {showSnackbar} from '../../../utils/SnackBar';
import {ISinglePost} from '../../BusinessSinglePost/useBusinessSinglePost';
import {IBusinessPost} from './BusinessPostItem';
import {IBusinessPostPage} from './useBusinessPosts';

export type likeFrom = 'home' | 'business_detail' | 'news' | 'timeline' | '';
export interface IResponseData {
  data: IBusinessPost[];
  error: boolean;
  message: string;
  status: number;
}

interface IBusinessPostPageCache {
  pages: IBusinessPostPage[];
  pageParams: [];
}

async function businessPostLike(
  contentId: string,
): Promise<number | undefined | null> {
  try {
    const url = `${config.BUSINESS_API_URL}/content/${contentId}/like`;
    const response: IResponseData = await client.post(url);
    if (!response.error) {
      return response.status;
    }
    return null;
  } catch (error) {
    return Promise.reject(error);
  }
}

async function businessPostDisLike(
  contentId: string,
): Promise<number | undefined | null> {
  try {
    const url = `${config.BUSINESS_API_URL}/content/${contentId}/like`;
    const response: IResponseData = await client.delete(url);
    if (!response.error) {
      return response.status;
    }
    return null;
  } catch (error) {
    return Promise.reject(error);
  }
}

const useBusinessPostActions = () => {
  const queryClient = useQueryClient();

  const updateBusinessPostsTimelineCache = async (
    contentId: string,
    key: string[],
    isLike: boolean,
  ) => {
    const businessPosts =
      await queryClient.getQueryData<IBusinessPostPageCache>(key);
    if (businessPosts) {
      const {pages} = businessPosts;
      const updatedPages = pages.map((c: any) => {
        const {data: posts, ...rest} = c;
        const updatedBusinessPosts = posts.map((post: IBusinessPost) => {
          if (post.documentId === contentId) {
            return {
              ...post,
              likesCount: isLike ? post.likesCount + 1 : post.likesCount - 1,
              isLiked: isLike,
            };
          }
          return post;
        });
        return {...rest, data: updatedBusinessPosts};
      });
      const updateBusinessPosts = {...businessPosts, pages: updatedPages};
      queryClient.setQueryData<IBusinessPostPageCache>(key, {
        ...updateBusinessPosts,
      });
    }
    updateBusinessSinglePostCache(contentId, isLike);
  };

  const updateBusinessSinglePostCache = async (
    contentId: string,
    isLike: boolean,
  ) => {
    const cacheKey = [QueryKeys.businessSinglePost, contentId];
    const businessPost = await queryClient.getQueryData<ISinglePost>(cacheKey);
    if (businessPost) {
      await queryClient.setQueryData<ISinglePost>(cacheKey, {
        ...businessPost,
        likesCount: isLike
          ? businessPost.likesCount + 1
          : businessPost.likesCount - 1,
        isLiked: isLike,
      });
    }
  };

  const businessPostLikeToggle = async (
    contentID: string,
    businessId: string,
    from: likeFrom,
    isLike: boolean,
  ) => {
    try {
      let status;
      switch (from) {
        case 'business_detail':
        case 'timeline':
          if (isLike) {
            status = await businessPostLike(contentID);
          } else {
            status = await businessPostDisLike(contentID);
          }
          break;
        default:
          break;
      }
      if (status === 200) {
        switch (from) {
          case 'home':
            break;
          case 'business_detail':
            updateBusinessPostsTimelineCache(
              contentID,
              [QueryKeys.businessPosts, businessId],
              isLike,
            );
            await queryClient.invalidateQueries([
              QueryKeys.businessDetails,
              contentID,
            ]);
            break;
          case 'timeline':
            updateBusinessPostsTimelineCache(
              contentID,
              [QueryKeys.businessPosts, businessId],
              isLike,
            );
            await queryClient.invalidateQueries([
              QueryKeys.businessDetails,
              contentID,
            ]);
            break;
          case 'news':
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
    businessPostLikeToggle,
  };
};

export {useBusinessPostActions};

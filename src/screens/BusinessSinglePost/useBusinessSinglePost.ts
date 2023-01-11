/**
 * @format
 */
import {useQuery} from 'react-query';

import client from 'api';

import {config} from '../../config';
import {QueryKeys} from '../../utils/QueryKeys';
import {IRequestMeta} from '../../constants/types';

export interface ISinglePost {
  businessName: string;
  background: {
    croppedImageDetails: string;
    croppedImageReadUrl: string;
    documentId: string;
    imageType: string;
    originalImageReadUrl: string;
  };
  logo: {
    croppedImageDetails: string;
    croppedImageReadUrl: string;
    documentId: string;
    imageType: string;
    originalImageReadUrl: string;
  };
  media: string;
  businessId: string;
  commentsCount: number;
  contentDataType: string;
  createdAt: string;
  documentId: string;
  image: {
    contentId: string;
    imageId: string;
    imageUrl: string;
  };
  isFollowing: boolean;
  isLiked: boolean;
  likes: number;
  likesCount: number;
  role: string;
  textContent: number;
  updatedAt: string;
  user: {
    croppedImageReadUrl: string;
    userId: string;
    userName: string;
  };
  userId: string;
}

export interface IResponseData extends IRequestMeta {
  data: ISinglePost;
}

async function fetchBusinessSinglePost(
  postId: string,
): Promise<ISinglePost | undefined> {
  try {
    const url = `${config.BUSINESS_API_URL}/contents/${postId}`;
    const response: IResponseData = await client.get(url);
    return response.data;
  } catch (error: any) {
    return undefined;
  }
}

const useBusinessSinglePost = (postId = '') => {
  const cacheKey = [QueryKeys.businessSinglePost, postId];
  return useQuery(cacheKey, () => fetchBusinessSinglePost(postId));
};

export {useBusinessSinglePost};

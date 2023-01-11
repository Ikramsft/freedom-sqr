/**
 * @format
 */
import {useMutation, useQueryClient} from 'react-query';

import client from 'api';

import {IRequestMeta} from '../../constants';
import {IBusinessPost} from '../BusinessDetail/BusinessPosts/BusinessPostItem';
import {QueryKeys} from '../../utils/QueryKeys';
import {config} from '../../config';
import {showSnackbar} from '../../utils/SnackBar';
import {IMedia} from './useCreatePostForm';

export interface IResponseData extends IRequestMeta {
  data: IBusinessPost;
}

export interface File extends Blob {
  readonly lastModified: number;
  readonly name: string;
  readonly webkitRelativePath: string;
}

export type ContentType = 'text' | 'image' | 'logo';

export interface ICreatePostRequest {
  mediaContent?: IMedia | null | undefined;
  contentDataType: ContentType;
  textContent: string;
}

export const useCreatePost = (
  businessId = '',
  callback?: (success: boolean) => void,
) => {
  const queryClient = useQueryClient();

  const createPost = async (data: ICreatePostRequest) => {
    try {
      const url = `${config.BUSINESS_API_URL}/${businessId}/content`;
      const headers = {'Content-Type': 'multipart/form-data'};
      const formData = new FormData();
      const {contentDataType, textContent, mediaContent} = data;
      formData.append('contentDataType', contentDataType);
      formData.append('textContent', textContent);
      if (mediaContent) {
        const {uri, name} = mediaContent;
        const type = uri.split('.').pop();
        const file = {
          name,
          type: `image/${type}`,
          uri,
        };
        formData.append('mediaContent', file);
      }

      const response: IResponseData = await client.post(url, formData, {
        headers,
      });
      const profile = response.data;
      return Promise.resolve(profile);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const postMutation = useMutation(createPost, {
    onSuccess: () => {
      const cacheKey = [QueryKeys.businessPosts, businessId];
      queryClient.invalidateQueries(cacheKey);
      callback?.(true);
    },
    onError: (error: any) => {
      const message = error.message ?? 'Something went wrong';
      showSnackbar({message, type: 'error'});
      callback?.(false);
    },
  });

  const tryCreatePost = (data: ICreatePostRequest) => postMutation.mutate(data);

  return {...postMutation, tryCreatePost};
};

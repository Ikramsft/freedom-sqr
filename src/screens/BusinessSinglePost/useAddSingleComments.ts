/**
 * @format
 */
import {useMutation, useQueryClient} from 'react-query';

import client from 'api';

import {showSnackbar} from '../../utils/SnackBar';
import {config} from '../../config';
import {QueryKeys} from '../../utils/QueryKeys';

interface ISingleCommentRequest {
  PostId: string;
  comment: string;
  callback?: (success: boolean) => void;
}

export const useAddSingleComment = () => {
  const queryClient = useQueryClient();

  async function addUpdateSinglePost(request: ISingleCommentRequest) {
    try {
      const {PostId, comment} = request;
      const url = `${config.BUSINESS_API_URL}/content/${PostId}/comment`;
      await client.post(url, {comment});
      return Promise.resolve();
    } catch (error: any) {
      return Promise.reject(error);
    }
  }

  const addCommentMutation = useMutation(addUpdateSinglePost, {
    onSuccess: (_data, variables) => {
      const {PostId, callback} = variables;
      const message = `Response added successfully`;
      showSnackbar({message, type: 'success'});
      callback?.(true);
      const cacheKey = [QueryKeys.singlePostComments, PostId];
      queryClient.invalidateQueries(cacheKey);
    },
    onError: (error: any, variables) => {
      const {callback} = variables;
      const message = error.message ?? 'Something went wrong';
      showSnackbar({message, type: 'error'});
      callback?.(false);
    },
  });

  const tryAddComment = (request: ISingleCommentRequest) =>
    addCommentMutation.mutate(request);

  return {...addCommentMutation, tryAddComment};
};

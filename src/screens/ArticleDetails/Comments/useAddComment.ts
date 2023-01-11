/**
 * @format
 */
import {useMutation, useQueryClient} from 'react-query';

import client from 'api';

import {showSnackbar} from '../../../utils/SnackBar';
import {config} from '../../../config';
import {QueryKeys} from '../../../utils/QueryKeys';

interface ICommentRequest {
  articleId: string;
  comment: string;
  callback?: (success: boolean) => void;
}

export const useAddComment = () => {
  const queryClient = useQueryClient();

  async function addComment(request: ICommentRequest) {
    try {
      const {articleId, comment} = request;
      const url = `${config.NEWS_API_URL}/users/news/${articleId}/comment`;
      await client.post(url, {comment});
      return Promise.resolve();
    } catch (error: any) {
      return Promise.reject(error);
    }
  }

  const addCommentMutation = useMutation(addComment, {
    onSuccess: (_data, variables) => {
      const {articleId, callback} = variables;
      const message = `Response added successfully`;
      showSnackbar({message, type: 'success'});
      callback?.(true);
      const cacheKey = [QueryKeys.commentList, articleId];
      queryClient.invalidateQueries(cacheKey);
    },
    onError: (error: any, variables) => {
      const {callback} = variables;
      const message = error.message ?? 'Something went wrong';
      showSnackbar({message, type: 'error'});
      callback?.(false);
    },
  });

  const tryAddComment = (request: ICommentRequest) =>
    addCommentMutation.mutate(request);

  return {...addCommentMutation, tryAddComment};
};

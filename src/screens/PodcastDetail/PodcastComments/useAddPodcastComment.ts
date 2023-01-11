/**
 * @format
 */
import {useMutation, useQueryClient} from 'react-query';

import client from 'api';

import {showSnackbar} from '../../../utils/SnackBar';
import {config} from '../../../config';
import {QueryKeys} from '../../../utils/QueryKeys';

interface ICommentRequest {
  episodeID: string;
  comment: string;
  callback?: (success: boolean) => void;
}

export const useAddPodcastComment = () => {
  const queryClient = useQueryClient();

  async function addUpdateBusiness(request: ICommentRequest) {
    try {
      const {episodeID, comment} = request;
      const url = `${config.PODCASTS_API_URL}/episode/${episodeID}/comment`;
      await client.post(url, {commentText: comment});
      return Promise.resolve();
    } catch (error: any) {
      return Promise.reject(error);
    }
  }

  const addCommentMutation = useMutation(addUpdateBusiness, {
    onSuccess: (_data, variables) => {
      const {episodeID, callback} = variables;
      const message = `Response added successfully`;
      showSnackbar({message, type: 'success'});
      callback?.(true);
      const cacheKey = [QueryKeys.podcastCommentList, episodeID];
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

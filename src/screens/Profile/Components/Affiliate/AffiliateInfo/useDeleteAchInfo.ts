/**
 * @format
 */
import {useMutation, useQueryClient} from 'react-query';

import client from 'api';

import {showSnackbar} from '../../../../../utils/SnackBar';
import {config} from '../../../../../config';
import {QueryKeys} from '../../../../../utils/QueryKeys';
import {IAchDetails} from '../ManageAchInfo/useAchForm';

export const useDeleteAchInfo = () => {
  const queryClient = useQueryClient();

  async function deleteAchInfo(request: IAchDetails) {
    try {
      const {documentId} = request;
      const url = `${config.PAYMENT_API_URL}/ach/${documentId}`;
      await client.delete(url);
      return Promise.resolve();
    } catch (error: any) {
      return Promise.reject(error);
    }
  }

  const updateCache = async (v: IAchDetails) => {
    const cacheKey = QueryKeys.achPaymentList;
    const list = await queryClient.getQueryData<IAchDetails[]>(cacheKey);
    if (list) {
      const updList = list.filter(l => l.documentId !== v.documentId);
      queryClient.setQueryData<IAchDetails[]>(cacheKey, updList);
    }
  };

  const deleteAchInfoMutation = useMutation(deleteAchInfo, {
    onSuccess: async (_, variables) => {
      const message = `ACH Info deleted successfully`;
      showSnackbar({message, type: 'success'});
      await updateCache(variables);
      queryClient.invalidateQueries(QueryKeys.achPaymentList);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message = error.message ?? 'Something went wrong';
      showSnackbar({message, type: 'error'});
    },
  });

  const tryDeleteAchInfo = (data: IAchDetails) =>
    deleteAchInfoMutation.mutate(data);

  return {
    ...deleteAchInfoMutation,
    tryDeleteAchInfo,
  };
};

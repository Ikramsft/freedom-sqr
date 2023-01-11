/**
 * @format
 */
import {useMutation, useQueryClient} from 'react-query';

import client from 'api';

import {showSnackbar} from '../../../../../utils/SnackBar';
import {config} from '../../../../../config';
import {IRequestMeta} from '../../../../../constants/types';
import {QueryKeys} from '../../../../../utils/QueryKeys';
import {IAchDetails} from './useAchForm';

interface IAchAddUpdateResponse extends IRequestMeta {
  data: IAchDetails;
}

type IAchInfoRequest = IAchDetails & {
  callback?: (success: boolean) => void;
};

export const useManageAchInfo = () => {
  const queryClient = useQueryClient();

  async function addUpdateAchInfo(request: IAchInfoRequest) {
    try {
      const {documentId, ...rest} = request;

      // Create Ach Info
      if (documentId === '') {
        const url = `${config.PAYMENT_API_URL}/ach`;
        const params = {...rest};
        const info: IAchAddUpdateResponse = await client.post(url, params);
        return Promise.resolve(info.data);
      }

      // Update Ach Info
      const url = `${config.PAYMENT_API_URL}/ach/${documentId}`;
      const businessInfo: IAchAddUpdateResponse = await client.put(url, {
        ...rest,
      });
      return Promise.resolve(businessInfo.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return Promise.reject(error);
    }
  }

  const updateCache = async (data: IAchDetails, isCreated: boolean) => {
    const cacheKey = QueryKeys.achPaymentList;
    const list = await queryClient.getQueryData<IAchDetails[]>(cacheKey);
    if (list) {
      if (isCreated) {
        const updList = [...list, data];
        queryClient.setQueryData<IAchDetails[]>(cacheKey, updList);
      } else {
        const updList = list.map(l =>
          l.documentId === data.documentId ? data : l,
        );
        queryClient.setQueryData<IAchDetails[]>(cacheKey, updList);
      }
    }
  };

  const addUpdateAchInfoMutation = useMutation(addUpdateAchInfo, {
    onSuccess: async (data, variables) => {
      const {documentId, callback} = variables;
      const createEdit = documentId === '' ? 'created' : 'updated';
      const message = `Account Details ${createEdit} successfully`;
      showSnackbar({message, type: 'success'});
      callback?.(true);
      await updateCache(data, documentId === '');
      queryClient.invalidateQueries(QueryKeys.achPaymentList);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any, variables) => {
      const {callback} = variables;
      const message = error.message ?? 'Something went wrong';
      showSnackbar({message, type: 'error'});
      callback?.(false);
    },
  });

  // Add Update
  const tryAddUpdateAchInfo = (data: IAchInfoRequest) =>
    addUpdateAchInfoMutation.mutate(data);

  return {
    ...addUpdateAchInfoMutation,
    tryAddUpdateAchInfo,
  };
};

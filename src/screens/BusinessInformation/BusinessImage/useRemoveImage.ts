/**
 * @format
 */
import React from 'react';
import {useQueryClient} from 'react-query';

import client from 'api';

import {showSnackbar} from '../../../utils/SnackBar';
import {config} from '../../../config';
import {IRequestMeta} from '../../../constants/types';
import {QueryKeys} from '../../../utils/QueryKeys';
import {ImageType} from './component/ImgBox';

type IRemoveImage = {documentId: string; type: ImageType};

export const useRemoveImage = () => {
  const queryClient = useQueryClient();

  const [info, setInfo] = React.useState({
    deleting: false,
    documentId: '',
  });

  async function tryRemoveImage(deleteInfo: IRemoveImage) {
    try {
      const {documentId} = deleteInfo;
      setInfo({deleting: true, documentId});
      const url = `${config.BUSINESS_API_URL}/business/image/${documentId}`;
      const response: IRequestMeta = await client.delete(url);
      queryClient.invalidateQueries(QueryKeys.businessInfo);
      const message = 'Image deleted successfully';
      showSnackbar({message, type: 'success'});
      return Promise.resolve(response);
    } catch (error: any) {
      setInfo({deleting: false, documentId: ''});
      const message = error.message ?? 'Something went wrong';
      showSnackbar({message, type: 'error'});
      return Promise.reject(error);
    }
  }

  return {...info, tryRemoveImage};
};

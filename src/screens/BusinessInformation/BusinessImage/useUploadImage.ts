/**
 * @format
 */
import React from 'react';
import {useQueryClient} from 'react-query';

import {ISelectFile} from 'components';

import {showSnackbar} from '../../../utils/SnackBar';
import {config} from '../../../config';
import {IRequestMeta} from '../../../constants/types';
import {QueryKeys} from '../../../utils/QueryKeys';
import {ImageType} from './component/ImgBox';
import {uploadBusinessImage} from '../../Profile/ProfileInformation/useProfileImageOperations';

export type IUploadImage = {
  businessId: string;
  imageId: string;
  imageType: ImageType;
  fileInfo: ISelectFile;
};

interface IUploadInfo {
  uploading: boolean;
  businessId: string;
  imageType: ImageType;
  // index: number;
}

export const useUploadImage = () => {
  const queryClient = useQueryClient();

  const [info, setInfo] = React.useState<IUploadInfo>({
    uploading: false,
    businessId: '',
    imageType: '',
    // index: -1,
  });

  async function tryUploadImage(uploadInfo: IUploadImage) {
    try {
      const {businessId, imageType, imageId, fileInfo} = uploadInfo;
      setInfo({uploading: true, businessId: imageId, imageType});

      const isAdding = imageId === '' || imageId === undefined;
      const url = isAdding
        ? `${config.BUSINESS_API_URL}/business/${businessId}/image`
        : `${config.BUSINESS_API_URL}/business/image/${imageId}`;

      const response: IRequestMeta = await uploadBusinessImage(
        fileInfo,
        imageType,
        url,
        isAdding ? 'POST' : 'PUT',
      );
      queryClient.invalidateQueries(QueryKeys.businessInfo);
      const message = `Image ${isAdding ? 'added' : 'updated'} successfully`;
      showSnackbar({message, type: 'success'});
      setInfo({uploading: false, businessId: '', imageType: ''});
      return Promise.resolve(response);
    } catch (error: any) {
      setInfo({uploading: false, businessId: '', imageType: ''});
      const message = error.message ?? 'Something went wrong';
      showSnackbar({message, type: 'error'});
      return Promise.reject(error);
    }
  }

  return {...info, tryUploadImage};
};

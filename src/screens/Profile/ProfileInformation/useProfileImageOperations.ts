import {ISelectFile, PicCroppedDetails} from 'components';

import client from 'api';

import {config} from '../../../config';
import {IRequestMeta} from '../../../constants';
import {showSnackbar} from '../../../utils/SnackBar';
import {saveBase64OnCache, removeFileFromCache} from '../../../utils';
import {ImageType} from '../../BusinessInformation/BusinessImage/component/ImgBox';

export interface IUploadResponse extends IRequestMeta {
  data: {
    originalImageReadUrl: string;
    croppedImageReadUrl: string;
    croppedImageDetails: PicCroppedDetails;
    imageViewAttribute: string;
  };
}

export const uploadProfile = async (
  data: ISelectFile,
  url = config.UPLOAD_PROFILE_IMAGE,
): Promise<IUploadResponse> => {
  try {
    const formData = new FormData();
    const imageViewAttribute = {
      data: data.data,
      canvasData: data.canvasData,
      cropBoxData: data.cropBoxData,
      minZoom: data.minZoom,
      zoom: data.zoom,
    };
    formData.append('imageViewAttribute', JSON.stringify(imageViewAttribute));

    const originalFileType = data.originalFile.uri.split('.').pop();
    const originalFileName = data.originalFile.name;
    const originalFile = {
      name: originalFileName,
      type: `image/${originalFileType}`,
      uri: data.originalFile.uri,
    };
    formData.append('image', originalFile);
    // save image to local cache for upload
    const croppedFile = await saveBase64OnCache(data.croppedFile);

    formData.append('croppedImage', croppedFile);

    const headers = {'Content-Type': 'multipart/form-data'};
    const response: IUploadResponse = await client.put(url, formData, {
      headers,
    });

    // remove the saved image from local cache
    await removeFileFromCache(croppedFile.uri);

    return Promise.resolve(response);
  } catch (error: any) {
    const message = error?.message ?? 'Something went wrong';
    showSnackbar({message, type: 'error'});
    return Promise.reject(error);
  }
};

type Method = 'POST' | 'PUT';

export const uploadBusinessImage = async (
  data: ISelectFile,
  imageType: ImageType,
  url: string,
  method: Method,
): Promise<IUploadResponse> => {
  try {
    const formData = new FormData();
    const imageViewAttribute = {
      data: data.data,
      canvasData: data.canvasData,
      cropBoxData: data.cropBoxData,
      minZoom: data.minZoom,
      zoom: data.zoom,
    };
    formData.append('imageViewAttribute', JSON.stringify(imageViewAttribute));

    const originalFileType = data.originalFile.uri.split('.').pop();
    const originalFileName = data.originalFile.name;
    const originalFile = {
      name: originalFileName,
      type: `image/${originalFileType}`,
      uri: data.originalFile.uri,
    };
    formData.append('image', originalFile);
    // save image to local cache for upload
    const croppedFile = await saveBase64OnCache(data.croppedFile);

    formData.append('croppedImage', croppedFile);
    formData.append('imageType', imageType);

    const headers = {'Content-Type': 'multipart/form-data'};
    const response: IUploadResponse =
      method === 'POST'
        ? await client.post(url, formData, {headers})
        : await client.put(url, formData, {headers});

    // remove the saved image from local cache
    await removeFileFromCache(croppedFile.uri);

    return Promise.resolve(response);
  } catch (error: any) {
    const message = error?.message ?? 'Something went wrong';
    showSnackbar({message, type: 'error'});
    return Promise.reject(error);
  }
};

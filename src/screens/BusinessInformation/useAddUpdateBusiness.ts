/**
 * @format
 */
import {useMutation, useQueryClient} from 'react-query';

import client from 'api';

import {showSnackbar} from '../../utils/SnackBar';
import {config} from '../../config';
import {IBusinessInfoForm} from './useBusinessInfoForm';
import {IRequestMeta} from '../../constants/types';
import {QueryKeys} from '../../utils/QueryKeys';
import {IBusinessDetailForm} from './useBusinessDetailForm';

interface IBusinessAddEditResponse extends IRequestMeta {
  data: {
    documentId?: string;
  };
}
interface ISocialLinks {
  socialLinks: ISocialLinks[];
  documentId: string;
}

type IBusinessRequest = IBusinessInfoForm & {
  isUpdate?: boolean;
  callback?: (success: boolean) => void;
};
type IBusinessDetailRequest = IBusinessDetailForm & {
  isUpdate?: boolean;
  callback?: (success: boolean) => void;
};

type IBusinessLinksRequest = ISocialLinks & {
  callback?: (success: boolean) => void;
};

export const useAddUpdateBusiness = () => {
  const queryClient = useQueryClient();

  async function addUpdateBusiness(request: IBusinessRequest) {
    try {
      const {documentId, isUpdate, ...rest} = request;
      if (documentId === '') {
        const url = `${config.BUSINESS_API_URL}/business`; // Create Business
        const businessInfo: IBusinessAddEditResponse = await client.post(url, {
          ...rest,
        });

        return Promise.resolve(businessInfo.data);
      }
      const url = `${config.BUSINESS_API_URL}/business/${documentId}`; // Edit Business

      if (isUpdate) {
        const businessInfo: IBusinessAddEditResponse = await client.patch(url, {
          ...rest,
        });
        return Promise.resolve(businessInfo.data);
      }
      const businessInfo: IBusinessAddEditResponse = await client.put(url, {
        ...rest,
      });
      return Promise.resolve(businessInfo.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return Promise.reject(error);
    }
  }

  async function addUpdateBusinessDetail(request: IBusinessDetailRequest) {
    try {
      const {documentId, ...rest} = request;
      if (documentId === '') {
        const url = `${config.BUSINESS_API_URL}/business/${documentId}`; // Create Business
        const businessInfo: IBusinessAddEditResponse = await client.post(url, {
          ...rest,
        });
        return Promise.resolve(businessInfo.data);
      }
      const url = `${config.BUSINESS_API_URL}/business/${documentId}`; // Edit Business
      const businessInfo: IBusinessAddEditResponse = await client.patch(url, {
        ...rest,
      });
      return Promise.resolve(businessInfo.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return Promise.reject(error);
    }
  }

  async function addUpdateBusinessSocialLinks(request: IBusinessLinksRequest) {
    try {
      const {documentId, ...rest} = request;
      if (documentId === '') {
        const url = `${config.BUSINESS_API_URL}/business/${documentId}`; // Create Business
        const businessInfo: IBusinessAddEditResponse = await client.post(url, {
          ...rest,
        });
        return Promise.resolve(businessInfo.data);
      }
      const url = `${config.BUSINESS_API_URL}/business/${documentId}`; // Edit Business
      const businessInfo: IBusinessAddEditResponse = await client.patch(url, {
        ...rest,
      });
      return Promise.resolve(businessInfo.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return Promise.reject(error);
    }
  }

  const addUpdateBusinessMutation = useMutation(addUpdateBusiness, {
    onSuccess: (data, variables) => {
      const {callback, isUpdate} = variables;
      const createEdit = isUpdate ? 'updated' : 'created';
      const message = `Business ${createEdit} successfully`;
      showSnackbar({message, type: 'success'});
      callback?.(true);
      queryClient.invalidateQueries(QueryKeys.businessInfo);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any, variables) => {
      const {callback} = variables;
      const message = error.message ?? 'Something went wrong';
      showSnackbar({message, type: 'error'});
      callback?.(false);
    },
  });

  const addUpdateBusinessDetailMutation = useMutation(addUpdateBusinessDetail, {
    onSuccess: (data, variables) => {
      const {callback, isUpdate} = variables;
      const message = `Business details ${
        isUpdate ? 'updated' : 'added'
      } successfully`;
      showSnackbar({message, type: 'success'});
      callback?.(true);
      queryClient.invalidateQueries(QueryKeys.businessInfo);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any, variables) => {
      const {callback} = variables;
      const message = error.message ?? 'Something went wrong';
      showSnackbar({message, type: 'error'});
      callback?.(false);
    },
  });

  const addUpdateBusinessLinksMutation = useMutation(
    addUpdateBusinessSocialLinks,
    {
      onSuccess: (data, variables) => {
        const {callback} = variables;
        const message = `Business social links updated successfully`;
        showSnackbar({message, type: 'success'});
        callback?.(true);
        queryClient.invalidateQueries([QueryKeys.businessInfo]);
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any, variables) => {
        const {callback} = variables;
        const message = error.message ?? 'Something went wrong';
        showSnackbar({message, type: 'error'});
        callback?.(false);
      },
    },
  );

  const tryAddUpdateBusiness = (data: IBusinessRequest) =>
    addUpdateBusinessMutation.mutate(data);

  const tryAddUpdateBusinessDetails = (data: IBusinessDetailRequest) =>
    addUpdateBusinessDetailMutation.mutate(data);

  const tryAddUpdateBusinessLinks = (data: IBusinessLinksRequest) =>
    addUpdateBusinessLinksMutation.mutate(data);

  return {
    ...addUpdateBusinessMutation,
    tryAddUpdateBusiness,

    ...addUpdateBusinessDetailMutation,
    tryAddUpdateBusinessDetails,

    ...addUpdateBusinessLinksMutation,
    tryAddUpdateBusinessLinks,
  };
};

/**
 * @format
 */
import {useQuery} from 'react-query';

import client from 'api';

import {config} from '../../config';
import {IRequestMeta, SocialLinks} from '../../constants';
import {QueryKeys} from '../../utils/QueryKeys';
import {ICategory} from './BusinessInfo/useBusinessCategories';
import {IBusinessInfoForm, SocialType} from './useBusinessInfoForm';

export interface SocialLink {
  link: string;
  socialType: SocialType;
}

export enum BusinessSteps {
  BUSINESS_INFO = 'business_info',
  BUSINESS_DETAILS = 'business_details',
  BUSINESS_SOCIAL_LINKS = 'business_socials',
  BUSINESS_IMAGES = 'business_images',
  PAYMENT = 'payment',
  PAYMENT_PROCESSING = 'payment_processing',
  PAYMENT_SUCCESS = 'payment_successful',
  PAYMENT_FAILED = 'payment_failed',
  PAYMENT_REFUND_PROCESSING = 'payment_refund_processing',
  PAYMENT_REFUND_SUCCESS = 'payment_refund_successful',
  PAYMENT_REFUND_FAILED = 'payment_refund_failed',
  COMPLETED = 'completed',
}

export enum BusinessSetupStatus {
  DRAFT = 'draft',
  PAYMENT_SUCCESSFUL = 'payment_successful',
  PAYMENT_DECLINED = 'payment_declined',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface IState {
  name: string;
  documentId: string;
}

export interface IImage {
  croppedImageDetails: string;
  croppedImageReadUrl: string;
  documentId: string;
  imageType: string;
  originalImageReadUrl: string;
}

export type BusinessImages = {
  background: IImage;
  media: IImage[];
  logo: IImage;
};

export type Role = 'owner' | 'none';

export interface IBusinessInfo {
  documentId: string;
  images: BusinessImages;
  step: BusinessSteps;
  status: BusinessSetupStatus;
  state: IState;
  isFollowing: boolean;
  role: Role;
  name: string;
  businessCategories: ICategory[];
  address: string;
  website: string;
  city: string;
  stateId: string;
  phone: string;
  zipcode: string;
  onlineOnly: boolean;
  email: string;
  contactPersonName: string;
  tagline: string;
  description: string;
  socialLinks: SocialLink[];
  followersCount: string;
}

export interface IBusinessListResponse extends IRequestMeta {
  data: IBusinessInfo[];
}

const findSocialValue = (socialLinks: SocialLink[], socialType: SocialType) => {
  const item = socialLinks.filter(s => s.socialType === socialType);
  return item.length > 0
    ? item[0].link.replace(SocialLinks[socialType], '')
    : '';
};

export const convertToBusinessForm = (info?: IBusinessInfo) => {
  if (info) {
    const {
      socialLinks,
      documentId,
      name,
      businessCategories,
      address,
      city,
      stateId,
      zipcode,
      website,
      phone,
      onlineOnly,
      contactPersonName,
      email,
      followersCount,
      isFollowing,
      role,
    } = info;

    const businessForm: IBusinessInfoForm = {
      documentId,
      name,
      businessCategoryIds: businessCategories.map(b => b.documentId),
      address,
      city,
      stateId,
      zipcode,
      website,
      phone: phone.replace('+1', ''),

      onlineOnly,
      facebook: findSocialValue(socialLinks, 'facebook'),
      instagram: findSocialValue(socialLinks, 'instagram'),
      linkedin: findSocialValue(socialLinks, 'linkedin'),
      twitter: findSocialValue(socialLinks, 'twitter'),
      contactPersonName,
      email,
      followersCount,
      isFollowing,
      role,
    };
    return businessForm;
  }
  return undefined;
};

async function fetchBusinessInfo(): Promise<IBusinessInfo | undefined> {
  try {
    const url = `${config.BUSINESS_API_URL}/business/users`;
    const response: IBusinessListResponse = await client.get(url);
    return response.data.length > 0 ? response.data[0] : undefined;
  } catch (error) {
    return undefined;
  }
}

export const useBusinessInfo = (enabled = true) => {
  const cacheKey = [QueryKeys.businessInfo];
  return useQuery(cacheKey, () => fetchBusinessInfo(), {enabled});
};

/**
 * @format
 */

import {PicCroppedDetails} from '../../components/ImageCropper/interfaces';

export interface IInterest {
  documentId: string;
  name: string;
}

export interface IProvider {
  documentID: string;
  name: string;
  isFollowed: boolean;
}

type LocationType = 'state' | 'territory';

export interface ILocation {
  code: string;
  documentId: string;
  name: string;
  type: LocationType;
}

export type UserType = 'individual' | 'business';
export interface IUser {
  documentId: string;
  email: string;
  fullName: string;
  interests: IInterest[];
  providers: IProvider[];
  isEmailVerified: boolean;
  affiliateUserId: string;
  states: ILocation[];
  userName: string;
  originalImageReadUrl: string;
  croppedImageReadUrl: string;
  imageViewAttribute: string;
  type: UserType;
  croppedImageDetails: PicCroppedDetails | undefined;
  influencerStatus: boolean;
}

export interface IUserState {
  authenticated: boolean;
  loading: boolean;
  errorMessage: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  user: IUser;
}

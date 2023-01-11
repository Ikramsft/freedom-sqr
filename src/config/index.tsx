/**
 * @format
 */
import Config from 'react-native-config';

// if (__DEV__) {
//   Config.BASE_URL = 'https://qa.freedomsquare.com/services/';
//   Config.WEB_URL = 'https://qa.freedomsquare.com/';
// }

export const config = {
  USER_API: `${Config.BASE_URL}user/v1`,
  PROFILE_API: `${Config.BASE_URL}account/v1/accounts`,
  PAYMENT_API_URL: `${Config.BASE_URL}payment/v1`,
  BUSINESS_API_URL: `${Config.BASE_URL}business/v1`,
  NEWS_API_URL: `${Config.BASE_URL}news/v1`,
  TIMELINE_API_URL: `${Config.BASE_URL}timeline/v1`,
  UPLOAD_PROFILE_IMAGE: `${Config.BASE_URL}user/v1/users/image`,
  PODCASTS_TIMELINE: `${Config.BASE_URL}podcast/v1`,
  RESOURCE_API_URL: `${Config.BASE_URL}resource/v1`,
  PODCASTS_EPISODES: `${Config.BASE_URL}podcasts/v1`,
  BUSINESS_TAB_URL: `${Config.BASE_URL}business/v1`,
  PODCASTS_LIKE_API_URL: `${Config.BASE_URL}podcasts/v1`,
  PODCASTS_API_URL: `${Config.BASE_URL}podcasts/v1`,
  ADS_API_URL: `${Config.BASE_URL}ads/v1`,
  AFFILIATE_API_URL: `${Config.BASE_URL}affiliates/v1`,
};

export const APP_BASE_URL = Config.BASE_URL;

export const APP_WEB_URL = Config.WEB_URL;

export const TERMS_WEB_URL = `${Config.WEB_URL}terms-and-conditions`;

export const POLICY_WEB_URL = `${Config.WEB_URL}privacy-policy`;
export const CORE_VALUES_WEB_URL = `${Config.WEB_URL}core-values`;

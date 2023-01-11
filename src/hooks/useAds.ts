/**
 * @format
 */

import {useQuery} from 'react-query';
import {Platform} from 'react-native';
import client from 'api';
import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';
import {StorageKeys, storage} from '../constants';
import {config} from '../config';
import {QueryKeys} from '../utils/QueryKeys';

export type AdvertisementType =
  | StorageKeys.CURRENT_D_SEQUENCE
  | StorageKeys.CURRENT_SEQUENCE
  | StorageKeys.MB_SEQUENCE
  | StorageKeys.MA_SEQUENCE
  | StorageKeys.MBA_SEQUENCE;

export interface IAdsItem {
  clickUrl: string;
  documentId: string;
  enddate: string;
  height: number;
  currentSequence: string;
  impressionUrl: string;
  media: string;
  page: string;
  position: string;
  sequence: number;
  startdate: string;
  text: string;
  type: string;
  width: number;
  url: string;
}

interface IAdsResponse {
  data?: IAdsItem[];
  error: boolean;
  message: string;
  status: number;
}
export interface IRequest {
  page: string;
  type?: string;
}

interface ITrackRequest {
  adId: string;
  event: string;
}

async function fetchAds(request: IRequest): Promise<IAdsItem[] | undefined> {
  try {
    let sequence = '';
    switch (request.page) {
      case 'home':
      case 'podcasts':
      case 'news':
        // eslint-disable-next-line no-case-declarations
        const ma_sequence = getAdvertisementStorageInfo(
          StorageKeys.MA_SEQUENCE,
        );
        // eslint-disable-next-line no-case-declarations
        const mb_sequence = getAdvertisementStorageInfo(
          StorageKeys.MB_SEQUENCE,
        );
        sequence =
          ma_sequence || mb_sequence
            ? `${ma_sequence},${mb_sequence}`
            : 'MA=0,MB=0';
        break;
      case 'following':
        // eslint-disable-next-line no-case-declarations
        const followingMASequence = getAdvertisementStorageInfo(
          StorageKeys.MA_SEQUENCE,
        );
        sequence = `${followingMASequence}`;
        break;

      case 'businesses':
        // eslint-disable-next-line no-case-declarations
        const businessesMASequence = getAdvertisementStorageInfo(
          StorageKeys.MBA_SEQUENCE,
        );
        sequence = businessesMASequence ? `${businessesMASequence}` : 'MA=0';
        break;

      default:
        break;
    }

    const url = `${config.ADS_API_URL}/ads?page=${
      request?.page
    }&currentSequence=${request.type || sequence}`;

    const response: IAdsResponse = await client.get(url);
    if (!request.type) {
      switch (request.page) {
        case 'home':
        case 'podcasts':
        case 'news':
          // eslint-disable-next-line no-case-declarations
          const commonSequence =
            response.data?.[0]?.currentSequence?.split(',');
          setAdvertisementInStorage(
            StorageKeys.MA_SEQUENCE,
            commonSequence?.[0] || '',
          );
          setAdvertisementInStorage(
            StorageKeys.MB_SEQUENCE,
            commonSequence?.[1] || '',
          );
          break;
        case 'following':
          // eslint-disable-next-line no-case-declarations
          const followingSequence = response.data?.[0]?.currentSequence;
          setAdvertisementInStorage(
            StorageKeys.MA_SEQUENCE,
            followingSequence || '',
          );
          break;
        case 'businesses':
          // eslint-disable-next-line no-case-declarations
          const businessesSequence = response.data?.[0]?.currentSequence;
          setAdvertisementInStorage(
            StorageKeys.MBA_SEQUENCE,
            businessesSequence || '',
          );

          break;

        default:
          break;
      }
    }
    return response.data;
  } catch (error) {
    return undefined;
  }
}

async function trackAdv(
  request: ITrackRequest,
): Promise<IAdsResponse | undefined> {
  try {
    const source = Platform.OS;
    const url = `${config.ADS_API_URL}/ads/track?adId=${request.adId}&event=${request.event}&src=${source}`;
    const response: IAdsResponse = await client.get(url);
    if (response.status === 200) {
      return {
        error: false,
        message: 'ad click tracked successfully',
        status: 200,
      };
    }
    return response;
  } catch (error) {
    return undefined;
  }
}

export const setAdvertisementInStorage = (
  key: AdvertisementType,
  sequence: string,
) => {
  storage.set(key, sequence);
};

export const clearAdvertisementStorageInfo = (key: AdvertisementType) => {
  storage.delete(key);
};

export const getAdvertisementStorageInfo = (key: AdvertisementType) => {
  const sequence = storage.getString(key);
  return sequence;
};

function useTrackAdv() {
  const handleAdvTrack = useCallback(async (data: ITrackRequest) => {
    await trackAdv(data);
  }, []);

  const getAdvertisement = async (request: IRequest) => {
    const response = await fetchAds(request);
    return response;
  };

  return {
    handleAdvTrack,
    getAdvertisement,
    setAdvertisementInStorage,
    clearAdvertisementStorageInfo,
    getAdvertisementStorageInfo,
  };
}

function useAds(request: IRequest) {
  const cacheKey = [QueryKeys.showAds];
  const query = useQuery(cacheKey, () => fetchAds(request), {
    enabled: false,
  });
  const {refetch} = query;

  useFocusEffect(
    useCallback(() => {
      refetch();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );
  return {...query};
}

export {useTrackAdv, useAds};

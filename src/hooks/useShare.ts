/**
 * @format
 */
import {Share, ShareContent} from 'react-native';

import client from 'api';

import {config} from '../config';
import {IRequestMeta} from '../constants';
import {showSnackbar} from '../utils/SnackBar';

export type ShareType = 'ArticleDetails' | 'PodcastDetails' | 'SinglePost';

interface IShare {
  documentId: string;
  title: string;
  type: ShareType;
  dialogTitle: string;
}

export interface IShareResponse extends IRequestMeta {
  data: {
    shareLink: string;
  };
}

const getPostShareUrl = async (url: string) => {
  try {
    const response: IShareResponse = await client.post(url);
    if (response.data && Object.keys(response.data).length > 0) {
      const shareLink = response.data?.shareLink;
      return shareLink;
    }
    return null;
  } catch (error: unknown) {
    return Promise.reject(error);
  }
};

function useShare() {
  const share = async (data: IShare) => {
    try {
      let url = ``;
      switch (data.type) {
        case 'ArticleDetails':
          url = `${config.NEWS_API_URL}/users/news/${
            data.documentId as string
          }/share`;
          break;
        case 'PodcastDetails':
          url = `${config.PODCASTS_EPISODES}/episode/${
            data?.documentId as string
          }/share`;
          break;
        case 'SinglePost':
          url = `${config.BUSINESS_API_URL}/contents/${data?.documentId}/share`;
          break;
        default:
          break;
      }
      const shareLink = await getPostShareUrl(url);

      if (shareLink) {
        const shareContent: ShareContent = {
          message: `${data?.title} ${shareLink}`,
          url: shareLink,
          title: data?.title,
        };
        await Share.share(shareContent, {dialogTitle: data.dialogTitle});
      }
    } catch (error: any) {
      const msg = error?.message || 'Something went wrong';
      showSnackbar({message: msg, type: 'error'});
    }
  };

  return {
    share,
  };
}

export default useShare;

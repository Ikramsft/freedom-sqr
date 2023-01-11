/**
 * @format
 */
import {useQuery} from 'react-query';

import client from 'api';

import {config} from '../../../config';
import {QueryKeys} from '../../../utils/QueryKeys';
import {IRequestMeta} from '../../../constants/types';
import {IShortNews, INewsData} from '../../News/Queries/useNewsFeed';

export interface IResponseData extends IRequestMeta {
  data: IShortNews[];
}

export const convertShortNewsToNews = (data: IShortNews[]) => {
  return data.map(d => {
    const {
      description,
      postId,
      isFeatured,
      postProvider,
      postedAt,
      providerUrl,
      thumbnail,
      title,
    } = d;
    const convert: INewsData = {
      author: '',
      category: '',
      comments: null,
      commentsCount: 0,
      content: '',
      desc: description,
      documentID: postId,
      featuredAt: '',
      guid: '',
      isFeatured,
      isLiked: false,
      likesCount: 0,
      link: '',
      mediaContent: {
        url: '',
        type: '',
        title: '',
        audios: [],
        images: [],
        locale: '',
        videos: null,
        article: {
          tags: null,
          authors: null,
          section: '',
          modified_time: null,
          published_time: null,
          expiration_time: null,
        },
        site_name: '',
        determiner: '',
        description: '',
        locales_alternate: null,
      },
      provider: {
        documentID: '',
        logo: '',
        name: postProvider,
        rss: '',
        slug: '',
        thumbnail: '',
        url: providerUrl,
      },
      providerID: '',
      pubDate: postedAt,
      thumbnail,
      title,
      updateDate: '',
    };
    return convert;
  });
};

async function fetchFeaturedPosts(): Promise<IShortNews[]> {
  try {
    const url = `${config.TIMELINE_API_URL}/timeline/posts?isFeatured=true&limit=6&offset=0`;
    const response: IResponseData = await client.get(url);
    return response.data;
  } catch (error: any) {
    return [];
  }
}

const useFeaturedPosts = () => {
  const cacheKey = [QueryKeys.featuredPosts];
  return useQuery(cacheKey, () => fetchFeaturedPosts());
};

export {useFeaturedPosts};

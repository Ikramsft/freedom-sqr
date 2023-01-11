/**
 * @format
 */
import {useQueryClient} from 'react-query';

import client from 'api';

import {config} from '../../../config';
import {QueryKeys} from '../../../utils/QueryKeys';
import {showSnackbar} from '../../../utils/SnackBar';
import {IPodcastEpisode} from '../../PodcastsChannel/Queries/usePodcastsEpisodes';
import {IPodcastsTimelinePage} from './usePodcastChannels';

export type likeFrom = 'home' | 'podcasts' | 'news' | 'timeline';
export interface IResponseData {
  data: IPodcastEpisode[];
  error: boolean;
  message: string;
  status: number;
}

interface IPodcastsTimelinePageCache {
  pages: IPodcastsTimelinePage[];
  pageParams: [];
}

async function episodeLike(
  documentId: string,
): Promise<number | undefined | null> {
  try {
    const url = `${config.PODCASTS_LIKE_API_URL}/episode/${documentId}/like`;
    const response: IResponseData = await client.post(url);
    if (!response.error) {
      return response.status;
    }
    return null;
  } catch (error) {
    return Promise.reject(error);
  }
}

async function episodeDisLike(
  documentId: string,
): Promise<number | undefined | null> {
  try {
    const url = `${config.PODCASTS_LIKE_API_URL}/episode/${documentId}/like`;
    const response: IResponseData = await client.delete(url);
    if (!response.error) {
      return response.status;
    }
    return null;
  } catch (error) {
    return Promise.reject(error);
  }
}

const useEpisodeActions = () => {
  const queryClient = useQueryClient();

  const updateEpisodesTimelineCache = async (
    episodeId: string,
    key: string[],
    isLike: boolean,
  ) => {
    const episodes = await queryClient.getQueryData<IPodcastsTimelinePageCache>(
      key,
    );
    if (episodes) {
      const {pages} = episodes;
      const updatedPages = pages.map((c: any) => {
        const {data: posts, ...rest} = c;
        const updatedEpisodes = posts.map((post: IPodcastEpisode) => {
          if (post.episodeID === episodeId) {
            return {
              ...post,
              likeCount: isLike ? post.likeCount + 1 : post.likeCount - 1,
              isLiked: isLike,
            };
          }
          return post;
        });
        return {...rest, data: updatedEpisodes};
      });
      const updateEpisodes = {...episodes, pages: updatedPages};
      queryClient.setQueryData<IPodcastsTimelinePageCache>(key, {
        ...updateEpisodes,
      });
    }
  };
  const updateEpisodesFeaturedCache = async (
    episodeId: string,
    key: string[],
    isLike: boolean,
  ) => {
    const episodes = await queryClient.getQueryData<IPodcastEpisode[]>(key);
    if (episodes) {
      const updatedEpisodes = episodes.map((post: IPodcastEpisode) => {
        if (post.episodeID === episodeId) {
          return {
            ...post,
            likeCount: isLike ? post.likeCount + 1 : post.likeCount - 1,
            isLiked: isLike,
          };
        }
        return post;
      });

      queryClient.setQueryData<IPodcastEpisode[]>(key, updatedEpisodes);
    }
  };

  const episodeLikeToggle = async (
    episodeID: string,
    from: likeFrom | string,
    isLike: boolean,
  ) => {
    try {
      let status;
      switch (from) {
        case 'podcasts':
        case 'timeline':
          if (isLike) {
            status = await episodeLike(episodeID);
          } else {
            status = await episodeDisLike(episodeID);
          }
          break;
        default:
          break;
      }
      if (status === 200) {
        switch (from) {
          case 'home':
            break;
          case 'podcasts':
            updateEpisodesFeaturedCache(
              episodeID,
              [QueryKeys.featuredPodcasts],
              isLike,
            );
            updateEpisodesTimelineCache(
              episodeID,
              [QueryKeys.allPodcastTimeline],
              isLike,
            );

            await queryClient.invalidateQueries([
              QueryKeys.podcastDetails,
              episodeID,
            ]);
            break;
          case 'timeline':
            updateEpisodesTimelineCache(
              episodeID,
              [QueryKeys.allPodcastTimeline],
              isLike,
            );
            updateEpisodesFeaturedCache(
              episodeID,
              [QueryKeys.featuredPodcasts],
              isLike,
            );
            await queryClient.invalidateQueries([
              QueryKeys.podcastDetails,
              episodeID,
            ]);
            break;
          case 'news':
            break;

          default:
            break;
        }
      }
    } catch (error: any) {
      const message = error.message ?? 'Something went wrong';
      showSnackbar({message, type: 'error'});
    }
  };
  return {
    episodeLikeToggle,
  };
};

export {useEpisodeActions};

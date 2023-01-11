/**
 * @format
 */
import {useQueryClient} from 'react-query';

import client from 'api';

import {config} from '../../../config';
import {QueryKeys} from '../../../utils/QueryKeys';
import {showSnackbar} from '../../../utils/SnackBar';
import {IPodcastEpisode, IPodcastEpisodePage} from './usePodcastsEpisodes';

export interface IResponseData {
  data: IPodcastEpisode[];
  error: boolean;
  message: string;
  status: number;
}

async function episodeLike(
  documentId: string,
): Promise<IPodcastEpisode | undefined | null> {
  try {
    const url = `${config.PODCASTS_LIKE_API_URL}/episode/${documentId}/like`;
    const response: IResponseData = await client.post(url);
    if (response.data.length > 0 && !response.error) {
      return response.data?.[0];
    }
    return null;
  } catch (error) {
    return Promise.reject(error);
  }
}

const useEpisodeActions = () => {
  const queryClient = useQueryClient();

  const updateEpisodesCache = async (episode: IPodcastEpisode) => {
    const cacheKey = [QueryKeys.PodcastsEpisodeList, episode.podcastShowID];
    const episodes = await queryClient.getQueryData<IPodcastEpisodePage>(
      cacheKey,
    );
    if (episodes) {
      const {data} = episodes;
      const updatedPages = data.map((c: any) => {
        const {data: posts, ...rest} = c;
        const updatedEpisodes = posts.map((post: IPodcastEpisode) => {
          if (post.episodeID === episode.episodeID) {
            return {...post, likeCount: post.likeCount + 1};
          }
          return post;
        });
        return {...rest, data: updatedEpisodes};
      });
      const updateEpisodes = {...episodes, data: updatedPages};
      queryClient.setQueryData<IPodcastEpisodePage>(cacheKey, {
        ...updateEpisodes,
      });
    }
  };

  const episodeLikeToggle = async (episode: IPodcastEpisode) => {
    try {
      const response = await episodeLike(episode?.episodeID);
      if (response) {
        updateEpisodesCache(episode);
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

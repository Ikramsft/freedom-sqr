/**
 * @format
 */
import React from 'react';
import {View, Text, Avatar, Divider} from 'native-base';

import {AppTheme} from 'theme';
import {SubTitle} from 'components';

import {timeDiffCalc} from '../../../../utils';
import {InfluencerTickIcon} from '../../../../assets/svg';

export interface IPodcastComment {
  commentID: string;
  comment: string;
  createdAt: string;
  episodeID: string;
  podcastID: string;
  user: {
    croppedImagePath: string;
    userId: string;
    userName: string;
    influencerStatus: boolean;
  };
}

interface ICommentItemProps {
  item: IPodcastComment;
  theme: AppTheme;
}

export function PodcastCommentItem(props: ICommentItemProps) {
  const {item, theme} = props;
  const {commentID, user, createdAt, comment} = item;
  const key = `comment-item-${commentID}`;

  return (
    <View key={key}>
      <View>
        <View alignItems="center" flexDirection="row" mt={2}>
          <View
            backgroundColor="red.200"
            height="35px"
            overflow="hidden"
            rounded="full"
            width="35px">
            <Avatar
              height="35px"
              rounded="full"
              source={{uri: user?.croppedImagePath}}
              width="35px"
            />
          </View>
          <View>
            {/* <Text fontSize="md" ml={2}>
              {user?.userName}
            </Text> */}
            <View alignItems="center" flexDirection="row">
              <Text fontSize="md" maxWidth="80%" ml={2} mr={2}>
                {user.userName}
              </Text>
              {user?.influencerStatus && (
                <InfluencerTickIcon height={16} width={16} />
              )}
            </View>
            <SubTitle fontSize="xs" ml={2}>
              {timeDiffCalc(createdAt)}
            </SubTitle>
          </View>
        </View>
        <Text fontSize="md">{comment}</Text>
      </View>
      <Divider backgroundColor={theme.colors.gray[300]} mt={3} />
    </View>
  );
}

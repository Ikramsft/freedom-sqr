/**
 * @format
 */
import React from 'react';
import {View, Text, Divider} from 'native-base';

import {SubTitle, UserAvatar} from 'components';

import {timeDiffCalc} from '../../../utils';
import {AppTheme} from '../../../theme/theme';
import {InfluencerTickIcon} from '../../../assets/svg';

export interface IComment {
  comment: string;
  createdAt: string;
  documentID: string;
  newsID: string;
  updatedAt: string;
  user: {
    influencerStatus: boolean;
    croppedImagePath: string;
    userId: string;
    userName: string;
  };
}

interface ICommentItemProps {
  item: IComment;
  theme: AppTheme;
}

export function CommentItem(props: ICommentItemProps) {
  const {item, theme} = props;
  const {user, createdAt, comment} = item;
  const key = `comment-item-${user.userName}`;

  return (
    <View key={key}>
      <View>
        <View alignItems="center" flexDirection="row" mt={2}>
          <UserAvatar profilePic={user.croppedImagePath} />
          <View width="90%">
            <View alignItems="center" flexDirection="row" width="100%">
              <Text fontSize="md" maxWidth="95%" ml={2} mr={2}>
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
        <Text fontSize="md" my={2}>
          {comment}
        </Text>
      </View>
      <Divider backgroundColor={theme.colors.gray[300]} mt={3} />
    </View>
  );
}

import * as React from 'react';
import {Avatar, Text, View} from 'native-base';

import {SubTitle} from 'components';

import {InfluencerTickIcon} from '../../assets/svg';
import {timeDiffCalc} from '../../utils';
import {ISingleComment} from './useSingleComments';

interface ISinglePostProps {
  item: ISingleComment;
}

function SinglePostItem(props: ISinglePostProps) {
  const {item} = props;
  return (
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
            source={{
              uri:
                item.user?.croppedImageReadUrl ||
                'data:image/png;base64,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',
            }}
            width="35px"
          />
        </View>
        <View>
          <View alignItems="center" flexDirection="row">
            <Text fontSize="md" maxWidth="80%" ml={2} mr={2}>
              {item.user?.userName}
            </Text>
            {item.user?.influencerStatus && (
              <InfluencerTickIcon height={16} width={16} />
            )}
          </View>
          <SubTitle fontSize="xs" ml={2}>
            {timeDiffCalc(item.createdAt)}
          </SubTitle>
        </View>
      </View>
      <Text fontSize="md">{item.comment}</Text>
    </View>
  );
}

export default SinglePostItem;

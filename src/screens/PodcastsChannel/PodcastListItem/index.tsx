import React from 'react';
import {Text, View, Divider} from 'native-base';

import {useAppTheme} from 'theme';
import {Button} from 'components';

import {IPodcastEpisode} from '../Queries/usePodcastsEpisodes';

interface Props {
  item: IPodcastEpisode;
  onListen?: (item: IPodcastEpisode) => void;
}

function PodcastListItem(props: Props) {
  const {item, onListen} = props;
  const theme = useAppTheme();

  const onListenPress = () => onListen?.(item);

  return (
    <View>
      <View>
        <View justifyContent="center">
          <Text color={theme.colors.brand[600]} fontSize={12} numberOfLines={2}>
            {item?.episodeName}
          </Text>
          <Text fontSize={16} numberOfLines={2}>
            {item?.episodeDescription}
          </Text>
          <View flexDirection="row" justifyContent="space-around" marginY={5}>
            <Button
              backgroundColor={theme.colors.black[900]}
              size="xs"
              title="LISTEN"
              onPress={onListenPress}
            />
            <Button
              backgroundColor={theme.colors.black[900]}
              size="xs"
              title="ADD TO PLAYLIST"
              onPress={onListenPress}
            />
          </View>
        </View>
        <View />
      </View>
      <Divider bgColor={theme.colors.black['500']} mb={4} />
    </View>
  );
}

PodcastListItem.defaultProps = {
  onListen: undefined,
};

export {PodcastListItem};

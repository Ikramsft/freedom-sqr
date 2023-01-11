/**
 * @format
 */
import React from 'react';
import {useWindowDimensions} from 'react-native';
import {Spinner, View} from 'native-base';
import {PodcastContentLoader} from './PodcastContentLoader';
import {ResourceContentLoader} from './ResourceContentLoader';
import {TimelineContentLoader} from './TimelineContentLoader';
import {BusinessContentLoader} from './BusinessContentLoader';

type LoaderType = 'Timeline' | 'Resource' | 'Podcast' | 'Business';

interface Props {
  count?: number;
  type?: LoaderType;
}

function ContentLoader(props: Props) {
  const {width} = useWindowDimensions();
  const {type, count = 1} = props;

  const getPlaceholder = () => {
    switch (type) {
      case 'Timeline':
        return <TimelineContentLoader {...props} width={width} />;
      case 'Resource':
        return <ResourceContentLoader {...props} width={width} />;
      case 'Podcast':
        return <PodcastContentLoader {...props} width={width} />;
      case 'Business':
        return <BusinessContentLoader {...props} width={width} />;
      default:
        return <Spinner />;
    }
  };

  return (
    <View>
      {Array.from({length: count}, (_, i) => (
        <View key={`content_loader_${type}_${i}`}>{getPlaceholder()}</View>
      ))}
    </View>
  );
}

ContentLoader.defaultProps = {
  count: 5,
  type: 'Timeline',
};

export {ContentLoader};

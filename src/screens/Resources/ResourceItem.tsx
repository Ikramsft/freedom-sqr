import React, {useMemo} from 'react';
import {Image, Text, View} from 'native-base';
import {Linking, StyleSheet} from 'react-native';

import {useAppTheme} from 'theme';
import {Button} from 'components';

import {IResourceData} from '../News/Queries/useNewsFeed';
import bgImage from '../../assets/images/bgImg.png';
import {openInAppBrowser, getResourceImage} from '../../utils';

interface Props {
  item: IResourceData;
}

function ResourceItem(props: Props) {
  const {item} = props;
  const {colors} = useAppTheme();

  const onViewClick = () => {
    Linking.canOpenURL(item.resourceViewUrl).then(supported => {
      if (supported) {
        openInAppBrowser(item.resourceViewUrl);
      } else {
        console.log(`Don't know how to open URI: ${item.resourceViewUrl}`);
      }
    });
  };

  const source = useMemo(
    () => getResourceImage(item.resourceName),
    [item.resourceName],
  );

  return (
    <View flexDirection="row" px={2} width="100%">
      <View borderColor="gray.500" borderRadius={5} borderWidth={1} mt={4}>
        <Image
          alt={`resource-image-${item.resourceName}`}
          source={source || bgImage}
          style={styles.postView}
        />
      </View>
      <View m={5}>
        <Text
          color={colors.black[600]}
          fontSize={16}
          fontWeight="bold"
          numberOfLines={4}>
          {item.resourceName}
        </Text>
        <View flexDirection="row" mt={4}>
          <Button px={10} title="View" onPress={onViewClick} />
        </View>
      </View>

      <View borderBottomColor="gray.500" borderBottomWidth={1} my={3} />
    </View>
  );
}

const styles = StyleSheet.create({
  postView: {
    width: 100,
    height: 105,
    borderRadius: 5,
  },
});
export default ResourceItem;

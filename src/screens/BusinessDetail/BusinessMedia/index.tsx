/**
 * @format
 */
import React from 'react';
import {Tabs} from 'react-native-collapsible-tab-view';
import {ListRenderItem, StyleSheet} from 'react-native';
import {Spinner, Text, View} from 'native-base';

import {
  ScrollView,
  SafeTouchable,
  Title,
  ProgressImage,
} from 'components';

import {IMedia, useBusinessMedia} from './useBusinessMedia';
import {SCREEN_WIDTH} from '../../../constants';
import {IBusinessInfo} from '../../BusinessInformation/useBusinessInfo';
import {useImageGallery} from '../../../redux/gallery';

interface Props {
  info: IBusinessInfo;
}

const IMG_WIDTH = (SCREEN_WIDTH - 10) / 3;

function BusinessMedia(props: Props) {
  const {info} = props;
  const {documentId: businessId, images} = info;

  const {showGallery} = useImageGallery();

  const {logo, background, media} = images;

  const renderItem: ListRenderItem<IMedia> = ({item}) => {
    const key = `misc-item-image-${item.imageId}`;
    return (
      <View height="120px" key={key} mb={3} width={IMG_WIDTH}>
        <SafeTouchable onPress={onImagePress(item.imageUrl)}>
          <ProgressImage source={{uri: item.imageUrl}} style={styles.image} />
        </SafeTouchable>
      </View>
    );
  };

  const {list = [], isLoading, onEndReached} = useBusinessMedia(businessId);

  const onImagePress = (uri: string) => () => showGallery([{uri}]);

  return (
    <Tabs.FlatList
      contentContainerStyle={styles.listStyle}
      data={list}
      keyboardShouldPersistTaps="handled"
      ListEmptyComponent={
        <View alignItems="center" mt={6}>
          <Text>No Misc available</Text>
        </View>
      }
      ListHeaderComponent={
        <>
          <View mb={2}>
            <Title fontSize="md" mb={2}>
              LOGO
            </Title>
            <View height="120px" key="logo-image" width={IMG_WIDTH}>
              <SafeTouchable onPress={onImagePress(logo.originalImageReadUrl)}>
                <ProgressImage
                  source={{uri: logo.croppedImageReadUrl}}
                  style={styles.image}
                />
              </SafeTouchable>
            </View>
          </View>
          <View mb={2}>
            <Title fontSize="md" mb={2}>
              BACKGROUND
            </Title>
            <View height="120px" key="background-image" width={IMG_WIDTH}>
              <SafeTouchable
                onPress={onImagePress(background.originalImageReadUrl)}>
                <ProgressImage
                  source={{uri: background.croppedImageReadUrl}}
                  style={styles.image}
                />
              </SafeTouchable>
            </View>
          </View>
          <View mb={2}>
            <Title fontSize="md" mb={2}>
              MEDIA
            </Title>
            <View height="120px">
              <ScrollView horizontal>
                {media?.map(m => {
                  const key = `media-image-${m.documentId}`;
                  return (
                    <View height="120px" key={key} mr={2} width={IMG_WIDTH}>
                      <SafeTouchable
                        onPress={onImagePress(m.originalImageReadUrl)}>
                        <ProgressImage
                          source={{uri: m.croppedImageReadUrl}}
                          style={styles.image}
                        />
                      </SafeTouchable>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          </View>
          {isLoading && <Spinner />}
          <View mb={2}>
            <Title fontSize="md">MISC</Title>
          </View>
        </>
      }
      numColumns={3}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
    />
  );
}

const styles = StyleSheet.create({
  listStyle: {
    width: '100%',
    paddingBottom: 50,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  image: {
    height: 120,
    width: SCREEN_WIDTH * 0.3,
  },
});

export {BusinessMedia};

import React from 'react';
import {
  FlatList,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import {Divider, Image, Spinner, Text, View} from 'native-base';

import {RootStackScreenProps} from 'navigation/DrawerNav';
import {useAppTheme} from 'theme';
import {
  SafeTouchable,
  HeaderLeft,
  HeaderTitle,
  SafeAreaContainer,
  SubTitle,
  ContentLoader,
} from 'components';

import {
  IPodcastEpisode,
  usePodcastsEpisodes,
} from './Queries/usePodcastsEpisodes';
import {PodcastListItem} from './PodcastListItem';
import {usePodcastData} from './Queries/usePodcastData';
import {openInAppBrowser} from '../../utils';

function PodcastsChannel(props: RootStackScreenProps<'PodcastsChannel'>) {
  const {route, navigation} = props;

  const {postProviderId} = route?.params || [];

  const theme = useAppTheme();

  const {
    podcastsEpisodeList,
    isLoading,
    refetch,
    isFetchingNextPage,
    onEndReached,
  } = usePodcastsEpisodes(postProviderId);

  const {data, isLoading: loadingData} = usePodcastData(postProviderId);
  const postProviderLogo = data?.externalShowImages?.[0]?.url || '';

  React.useLayoutEffect(() => {
    const headerLeft = () => <HeaderLeft onPress={navigation.goBack} />;
    const headerTitle = () => <HeaderTitle title={data?.name} />;
    navigation.setOptions({
      headerShown: true,
      headerBackVisible: false,
      headerTitleAlign: 'center',
      headerTitle,
      headerLeft,
      headerRight: () => null,
    });
  }, [data?.name, navigation]);

  const onListen = (item: IPodcastEpisode) =>
    navigation.push('PodcastDetail', {episodeID: item.episodeID});

  const renderItem: ListRenderItem<IPodcastEpisode> = ({item}) => {
    return <PodcastListItem item={item} onListen={onListen} />;
  };

  const keyExtractor = React.useCallback(
    (item: IPodcastEpisode, index: number) => `key-${index}-${item.episodeID}`,
    [],
  );

  const openChannel = () => {
    if (data?.externalShowLink) {
      openInAppBrowser(data.externalShowLink);
    }
  };

  return (
    <SafeAreaContainer>
      <View px={4}>
        <FlatList
          contentContainerStyle={styles.listContent}
          data={podcastsEpisodeList}
          keyExtractor={keyExtractor}
          ListEmptyComponent={
            isLoading ? <ContentLoader type="Podcast" /> : null
          }
          ListFooterComponent={
            isFetchingNextPage ? <Spinner mb={20} mt={10} /> : null
          }
          ListHeaderComponent={
            <View my={2}>
              <Image
                alignSelf="center"
                alt="Podcast Image"
                borderRadius={5}
                height={360}
                key={postProviderLogo}
                source={{uri: postProviderLogo}}
                width="100%"
              />
              <Text alignSelf="center" my={4}>
                {data?.externalShowDescription}
              </Text>
              <SafeTouchable onPress={openChannel}>
                <SubTitle
                  alignSelf="center"
                  color={theme.colors.brand['600']}
                  my={4}>
                  {data?.externalShowName}
                </SubTitle>
              </SafeTouchable>
              <Divider
                alignSelf="center"
                bgColor={theme.colors.black['900']}
                height="0.5"
                marginY={5}
              />
            </View>
          }
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={refetch} />
          }
          refreshing={isLoading || loadingData}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.8}
        />
      </View>
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  listContent: {
    flexGrow: 1,
  },
});

export default PodcastsChannel;

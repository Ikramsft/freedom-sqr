/**
 * @format
 */
import React from 'react';
import {
  FlatList,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import {View} from 'native-base';
import {useScrollToTop} from '@react-navigation/native';
import {useQueryClient} from 'react-query';
import _ from 'lodash';

import {Button} from 'components';
import {closeKeyboard, toggleElement, sortArray} from 'utils';

import {usePodcasts} from './usePodcasts';
import {usePreferencesActions} from '../../Queries/usePreferencesActions';
import {PreferenceItem} from '../PreferenceItem';
import {QueryKeys} from '../../../../utils/QueryKeys';
import {IPodcastsTimelineData} from '../../../../screens/PodcastTimeLine/Queries/usePodcastChannels';
import {MIN_SEARCH_CHARACTERS} from '../index';
import {PreferenceSearchInput} from '../PreferenceSearchInput';

function Podcasts() {
  const ref = React.useRef(null);
  useScrollToTop(ref);
  const queryClient = useQueryClient();

  const [query, setQuery] = React.useState('');

  const {data, isLoading, refetch} = usePodcasts();

  const {updateFollowedPodcasts} = usePreferencesActions();

  const [saveLoad, setSaveLoad] = React.useState(false);

  const [selected, setSelected] = React.useState<string[] | undefined>(
    undefined,
  );

  React.useEffect(() => {
    if (!isLoading && selected === undefined) {
      const initialValues =
        data?.filter(d => d.isFollowed).map(d => d.documentId) ?? [];
      setSelected(initialValues);
    }
  }, [data, isLoading, selected]);

  const saveAll = React.useCallback(async () => {
    if (selected) {
      setSaveLoad(true);
      try {
        await updateFollowedPodcasts(selected);
        queryClient.invalidateQueries([QueryKeys.following]);
        setSaveLoad(false);
      } catch (error) {
        setSaveLoad(false);
      }
    }
  }, [queryClient, selected, updateFollowedPodcasts]);

  const onToggleFollow = (id: string) => {
    if (selected) {
      const updatedSelected = toggleElement(selected, id);
      setSelected(updatedSelected);
    }
  };

  const keyExtractor = React.useCallback(
    (item: IPodcastsTimelineData, index: number) =>
      `podcasts-preference-timeline-key-${index}-${item.documentId}`,
    [],
  );

  const renderItem: ListRenderItem<IPodcastsTimelineData> = ({item, index}) => {
    return (
      <PreferenceItem
        checked={selected?.includes(item.documentId) ?? false}
        index={index}
        item={item}
        section={{type: 'podcasts', checkbox: true}}
        onToggleFollow={onToggleFollow}
      />
    );
  };

  const podcastsData = React.useMemo(() => {
    if (query !== '' && query.length >= MIN_SEARCH_CHARACTERS) {
      return _.filter(data, i =>
        i.name.toLowerCase().includes(query.toLowerCase()),
      );
    }
    return data;
  }, [data, query]);

  const onClearPress = () => {
    closeKeyboard();
    setQuery('');
  };

  const originalIds = React.useMemo(() => {
    return data?.filter(d => d.isFollowed).map(d => d.documentId) ?? [];
  }, [data]);

  const updateDisabled = () => {
    const original = originalIds.sort(sortArray);
    const userChoice = selected?.sort(sortArray);
    return original.join(',') === userChoice?.join(',');
  };

  return (
    <View pt={2} style={styles.container}>
      <PreferenceSearchInput
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="Search Podcasts"
        showClear={query !== ''}
        value={query}
        onChangeText={setQuery}
        onClearPress={onClearPress}
      />
      <FlatList
        data={podcastsData}
        key="podcasts-preference-timeline"
        keyExtractor={keyExtractor}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
        renderItem={renderItem}
      />
      <View alignItems="center" pb={1} pt={3} px={2}>
        <Button
          fontWeight="400"
          isDisabled={isLoading || saveLoad || updateDisabled()}
          isLoading={saveLoad}
          minHeight="44px"
          testID="preferences-confirm-button"
          title="UPDATE"
          width="70%"
          onPress={saveAll}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export {Podcasts};

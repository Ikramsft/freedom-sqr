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
import {Spinner, Text, View} from 'native-base';
import {useScrollToTop} from '@react-navigation/native';
import {useQueryClient} from 'react-query';
import _ from 'lodash';

import {Button} from 'components';
import {closeKeyboard, toggleElement, sortArray} from 'utils';

import {useBusiness} from './useBusiness';
import {IBusinessItem} from '../../../../screens/BusinessTab/Queries/useBusinessTab';
import {usePreferencesActions} from '../../../../screens/Following/Queries/usePreferencesActions';
import {PreferenceItem} from '../PreferenceItem';
import {QueryKeys} from '../../../../utils/QueryKeys';
import {PreferenceSearchInput} from '../PreferenceSearchInput';
import {MIN_SEARCH_CHARACTERS} from '../index';

function Business() {
  const ref = React.useRef(null);
  useScrollToTop(ref);
  const queryClient = useQueryClient();

  const [saveLoad, setSaveLoad] = React.useState(false);

  const [query, setQuery] = React.useState('');

  const {
    list,
    isLoading,
    isRefetching,
    refetch,
    isFetchingNextPage,
    onEndReached,
  } = useBusiness(query.length >= MIN_SEARCH_CHARACTERS ? query : '');

  const [selected, setSelected] = React.useState<string[] | undefined>(
    undefined,
  );

  React.useEffect(() => {
    if (!isLoading && selected === undefined) {
      const initialValues =
        list?.filter(d => d.isFollowing).map(d => d.documentId) ?? [];
      setSelected(initialValues);
    }
  }, [list, isLoading, selected]);

  const {updateFollowedBusiness} = usePreferencesActions();

  const saveAll = React.useCallback(async () => {
    if (selected) {
      setSaveLoad(true);
      try {
        await updateFollowedBusiness(selected);

        queryClient.invalidateQueries([QueryKeys.following]);
        queryClient.invalidateQueries([QueryKeys.featuredBusiness]);
        queryClient.invalidateQueries([QueryKeys.recentBusiness]);
        queryClient.invalidateQueries([QueryKeys.allBusiness]);

        setSaveLoad(false);
      } catch (error) {
        setSaveLoad(false);
      }
    }
  }, [queryClient, selected, updateFollowedBusiness]);

  const onToggleFollow = (id: string) => {
    if (selected) {
      const updatedSelected = toggleElement(selected, id);
      setSelected(updatedSelected);
    }
  };

  const keyExtractor = React.useCallback(
    (item: IBusinessItem, index: number) =>
      `business-preference-timeline-key-${index}-${item.documentId}`,
    [],
  );

  const renderItem: ListRenderItem<IBusinessItem> = ({item, index}) => {
    return (
      <PreferenceItem
        checked={selected?.includes(item.documentId) ?? false}
        index={index}
        item={item}
        section={{type: 'business', checkbox: true}}
        onToggleFollow={onToggleFollow}
      />
    );
  };

  const onClearPress = () => {
    closeKeyboard();
    setQuery('');
  };

  const originalIds = React.useMemo(() => {
    return list?.filter(d => d.isFollowing).map(d => d.documentId) ?? [];
  }, [list]);

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
        placeholder="Search Business Network"
        showClear={query !== ''}
        value={query}
        onChangeText={setQuery}
        onClearPress={onClearPress}
      />
      <FlatList
        data={list}
        key="business-preference-timeline"
        keyExtractor={keyExtractor}
        ListEmptyComponent={
          !isLoading && !isRefetching ? (
            <View alignItems="center" mt={6}>
              <Text>No businesses found</Text>
            </View>
          ) : null
        }
        ListFooterComponent={isFetchingNextPage ? <Spinner /> : null}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
        renderItem={renderItem}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
      />
      <View alignItems="center" pb={1} pt={3} px={2}>
        <Button
          fontWeight="400"
          isDisabled={isLoading || saveLoad || updateDisabled()}
          isLoading={saveLoad}
          loadingText="UPDATING"
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

export {Business};

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

import {useNews} from './useNewsProviders';
import {usePreferencesActions} from '../../Queries/usePreferencesActions';
import {PreferenceItem} from '../PreferenceItem';
import {QueryKeys} from '../../../../utils/QueryKeys';
import {IProvider} from '../../../../redux/user/userInterface';
import {MIN_SEARCH_CHARACTERS} from '../index';
import {PreferenceSearchInput} from '../PreferenceSearchInput';

function NewsProviders() {
  const ref = React.useRef(null);
  useScrollToTop(ref);
  const queryClient = useQueryClient();

  const [query, setQuery] = React.useState('');

  const {data, isLoading, refetch} = useNews();

  const {updateFollowedProviders} = usePreferencesActions();

  const [saveLoad, setSaveLoad] = React.useState(false);

  const [selected, setSelected] = React.useState<string[] | undefined>(
    undefined,
  );

  React.useEffect(() => {
    if (!isLoading && selected === undefined) {
      const initialValues =
        data?.filter(d => d.isFollowed).map(d => d.documentID) ?? [];
      setSelected(initialValues);
    }
  }, [data, isLoading, selected]);

  const saveAll = React.useCallback(async () => {
    if (selected) {
      setSaveLoad(true);
      try {
        await updateFollowedProviders(selected);
        queryClient.invalidateQueries([QueryKeys.following]);
        setSaveLoad(false);
      } catch (error) {
        setSaveLoad(false);
      }
    }
  }, [queryClient, selected, updateFollowedProviders]);

  const onToggleFollow = (id: string) => {
    if (selected) {
      const updatedSelected = toggleElement(selected, id);
      setSelected(updatedSelected);
    }
  };

  const keyExtractor = React.useCallback(
    (item: IProvider, index: number) =>
      `news-preference-timeline-key-${index}-${item.documentID}`,
    [],
  );

  const renderItem: ListRenderItem<IProvider> = ({item, index}) => {
    return (
      <PreferenceItem
        checked={selected?.includes(item.documentID) ?? false}
        index={index}
        item={item}
        section={{type: 'providers', checkbox: true}}
        onToggleFollow={onToggleFollow}
      />
    );
  };

  const newsData = React.useMemo(() => {
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
    return data?.filter(d => d.isFollowed).map(d => d.documentID) ?? [];
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
        placeholder="Search News Providers"
        showClear={query !== ''}
        value={query}
        onChangeText={setQuery}
        onClearPress={onClearPress}
      />
      <FlatList
        data={newsData}
        key="providers-preference-timeline"
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

export {NewsProviders};

import React, {useMemo} from 'react';
import {View, Text, Divider} from 'native-base';
import {FlatList, ListRenderItem, StyleSheet} from 'react-native';
import {IItem} from 'native-base/lib/typescript/components/composites/Typeahead/useTypeahead/types';
import {useAppTheme} from 'theme';
import {ContentLoader} from 'components';
import BusinessItem from '../FeaturedBusiness/BusinessItem';
import {IBusinessItem} from '../Queries/useBusinessTab';
import ShowMore from '../FeaturedBusiness/ShowMore';
import {useRecentBusiness} from '../Queries/useBusinessList';

interface IRecentAdded {
  navigation: IItem;
  onSelect?: (item: IBusinessItem) => void;
}

function RecentAdded(props: IRecentAdded) {
  const {navigation, onSelect} = props;
  const theme = useAppTheme();

  const {data: businessTabList = [], isLoading} = useRecentBusiness();

  const handleShowMore = () =>
    navigation.navigate('BusinessList', {
      heading: 'Recently Added',
      type: 'recent',
    });

  const renderItem: ListRenderItem<IBusinessItem> = ({item}) => {
    return <BusinessItem item={item} onSelect={onSelect} />;
  };
  const keyExtractor = React.useCallback(
    (item: IBusinessItem, index: number) =>
      `key-recent-added-${index}-${item.documentId}-${item.isFollowing}`,
    [],
  );

  const businessList = useMemo(
    () => businessTabList?.slice(0, 4),
    [businessTabList],
  );

  return (
    <View mb={businessTabList?.length > 0 ? 5 : 0}>
      <FlatList
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.contentView}
        data={businessList}
        extraData={businessTabList}
        keyExtractor={keyExtractor}
        ListEmptyComponent={
          isLoading ? (
            <ContentLoader count={1} type="Business" />
          ) : (
            <View mx={2}>
              <View pt={2}>
                <Text fontSize={16} fontWeight={600}>
                  No businesses available
                </Text>
              </View>
            </View>
          )
        }
        ListHeaderComponent={
          <View mx={2}>
            <View pt={2}>
              <Text fontSize="2xl" fontWeight={700}>
                Recently Added
              </Text>
            </View>
            <Divider />
          </View>
        }
        numColumns={2}
        refreshing={isLoading}
        renderItem={renderItem}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      />
      {businessTabList && businessTabList?.length > 4 && (
        <ShowMore handleShowMore={handleShowMore} theme={theme} />
      )}
    </View>
  );
}

RecentAdded.defaultProps = {
  onSelect: undefined,
};
const styles = StyleSheet.create({
  contentView: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  column: {
    width: '50%',
    marginVertical: 5,
  },
});

export default RecentAdded;

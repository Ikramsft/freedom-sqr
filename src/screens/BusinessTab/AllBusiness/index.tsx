import React, {useMemo} from 'react';
import {View, Text, Divider} from 'native-base';
import {FlatList, ListRenderItem, StyleSheet} from 'react-native';
import {IItem} from 'native-base/lib/typescript/components/composites/Typeahead/useTypeahead/types';
import {useAppTheme} from 'theme';
import {ContentLoader} from 'components';
import BusinessItem from '../FeaturedBusiness/BusinessItem';
import {IBusinessItem} from '../Queries/useBusinessTab';
import ShowMore from '../FeaturedBusiness/ShowMore';
import {useAllBusiness} from '../Queries/useBusinessList';

interface IAllBusiness {
  navigation: IItem;
  onSelect?: (item: IBusinessItem) => void;
}

function AllBusiness(props: IAllBusiness) {
  const {navigation, onSelect} = props;
  const theme = useAppTheme();

  const {data: businessTabList = [], isLoading} = useAllBusiness();

  const handleShowMore = () =>
    navigation.navigate('BusinessList', {heading: 'All Business', type: 'all'});

  const renderItem: ListRenderItem<IBusinessItem> = ({item}) => {
    return <BusinessItem item={item} onSelect={onSelect} />;
  };

  const keyExtractor = React.useCallback(
    (item: IBusinessItem, index: number) =>
      `key-all-business${index}-${item.documentId}-${item.isFollowing}`,
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
                All Business
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

AllBusiness.defaultProps = {
  onSelect: undefined,
};

const styles = StyleSheet.create({
  contentView: {
    justifyContent: 'space-between',
  },
  column: {
    width: '50%',
    marginVertical: 5,
  },
});

export default AllBusiness;

/**
 * @format
 */
import React, {useEffect} from 'react';
import {View, Spinner} from 'native-base';

import {Button, ScrollView, SafeAreaContainer} from 'components';

import {useProviderList, useUserProviderList} from './useProvidersList';
import {useUpdateProvider} from './useUpdateProviders';
import {IProvider} from '../../../../redux/user/userInterface';
import {ProviderItem} from './ProvidersItem';

function Providers() {
  const {data: userProviderList = [], isLoading: isFetching} =
    useUserProviderList();
  const {data = [], isLoading} = useProviderList();

  const {tryUpdateProviders, isLoading: isUpdating} = useUpdateProvider();

  const [checked, setChecked] = React.useState<string[]>(
    userProviderList?.map(i => i.documentID),
  );

  useEffect(() => {
    if (userProviderList.length) {
      setChecked(userProviderList?.map(i => i.documentID));
    }
  }, [userProviderList]);

  const onSavePress = () => tryUpdateProviders({providerIds: checked});

  const toggleCheck = (location: IProvider, selected: boolean) => {
    if (selected) {
      setChecked(s => [...s, location.documentID]);
    } else {
      setChecked(s => s.filter(i => i !== location.documentID));
    }
  };

  return (
    <SafeAreaContainer>
      <ScrollView>
        <View
          alignSelf="center"
          pointerEvents={isUpdating ? 'none' : 'auto'}
          width="50%">
          <View mt={2} pl={4}>
            {isLoading || isFetching ? (
              <Spinner />
            ) : (
              <>
                {data.map(l => {
                  const key = `${l.documentID}${l.name}`;
                  return (
                    <ProviderItem
                      isChecked={checked?.includes(l.documentID)}
                      item={l}
                      key={key}
                      onToggle={toggleCheck}
                    />
                  );
                })}
              </>
            )}
          </View>
        </View>
      </ScrollView>
      <View alignSelf="center" mb={3} mt={2} width="60%">
        <Button
          disabled={isUpdating}
          loading={isUpdating}
          loadingText="Updating"
          title="UPDATE"
          onPress={onSavePress}
        />
      </View>
    </SafeAreaContainer>
  );
}

export {Providers};

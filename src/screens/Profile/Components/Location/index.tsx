/**
 * @format
 */
import React from 'react';
import {View, Spinner} from 'native-base';

import {
  Button,
  ScrollView,
  Checkbox,
  SafeAreaContainer,
  Title,
} from 'components';

import {useLocationList} from './useLocationList';
import {LocationItem} from './LocationItem';
import {useUserInfo} from '../../../../hooks/useUserInfo';
import {ILocation} from '../../../../redux/user/userInterface';
import {useUpdateLocation} from './useUpdateLocation';

function Location() {
  const {user} = useUserInfo();

  const {tryUpdateStates, isLoading: isUpdating} = useUpdateLocation();

  const {data = [], isLoading} = useLocationList();

  const [states, setStates] = React.useState<string[]>(
    user.states.filter(s => s.type === 'state').map(s => s.documentId),
  );

  const [territories, setTerritories] = React.useState<string[]>(
    user.states.filter(s => s.type === 'territory').map(s => s.documentId),
  );

  const onSavePress = () =>
    tryUpdateStates({stateIds: [...states, ...territories]});

  const statesList: ILocation[] = React.useMemo(
    () => data.filter(l => l.type === 'state'),
    [data],
  );
  const stateIndeterminate = React.useMemo(
    () => states.length > 0 && states.length !== statesList.length,
    [states, statesList],
  );

  const stateChecked = React.useMemo(
    () => states.length === statesList.length,
    [states, statesList],
  );

  const territoriesList: ILocation[] = React.useMemo(
    () => data.filter(l => l.type === 'territory'),
    [data],
  );

  const territoriesIndeterminate = React.useMemo(
    () =>
      territories.length > 0 && territories.length !== territoriesList.length,
    [territories, territoriesList],
  );

  const territoriesChecked = React.useMemo(
    () => territories.length === territoriesList.length,
    [territories, territoriesList],
  );

  const toggleState = (location: ILocation, selected: boolean) => {
    if (selected) {
      setStates(s => [...s, location.documentId]);
    } else {
      setStates(s => s.filter(i => i !== location.documentId));
    }
  };

  const onToggleStates = (selected: boolean) => {
    if (!selected && !stateIndeterminate) {
      setStates([]);
    } else {
      const allStateIds = statesList.map(s => s.documentId);
      setStates(allStateIds);
    }
  };

  const toggleTerritory = (location: ILocation, selected: boolean) => {
    if (selected) {
      setTerritories(s => [...s, location.documentId]);
    } else {
      setTerritories(s => s.filter(i => i !== location.documentId));
    }
  };

  const onToggleTerritories = (selected: boolean) => {
    console.log('selected-->', selected);
    console.log('territoriesChecked-->', territoriesChecked);
    if (!selected && !territoriesIndeterminate) {
      setTerritories([]);
    } else {
      const allTerritoriesIds = territoriesList.map(s => s.documentId);
      setTerritories(allTerritoriesIds);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaContainer>
        <Spinner />
      </SafeAreaContainer>
    );
  }

  return (
    <SafeAreaContainer>
      <ScrollView>
        <View flexDirection="row" mt={2}>
          <View flex={0.5} pl={2}>
            <Checkbox
              indeterminate={stateIndeterminate}
              isChecked={stateChecked}
              key="State"
              value="states"
              onChange={onToggleStates}>
              <Title>States</Title>
            </Checkbox>
            <View pl={4}>
              {statesList.map(l => {
                const key = `${l.documentId}${l.name}`;
                return (
                  <LocationItem
                    isChecked={states.includes(l.documentId)}
                    item={l}
                    key={key}
                    onToggle={toggleState}
                  />
                );
              })}
            </View>
          </View>
          <View flex={0.45}>
            <Checkbox
              indeterminate={territoriesIndeterminate}
              isChecked={territoriesChecked}
              key="Territories"
              value="territories"
              onChange={onToggleTerritories}>
              <Title>Territories & Districts</Title>
            </Checkbox>
            <View pl={4}>
              {territoriesList.map(l => {
                const key = `${l.documentId}${l.name}`;
                return (
                  <LocationItem
                    isChecked={territories.includes(l.documentId)}
                    item={l}
                    key={key}
                    onToggle={toggleTerritory}
                  />
                );
              })}
            </View>
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

export {Location};

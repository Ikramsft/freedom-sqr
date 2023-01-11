/**
 * @format
 */
import React from 'react';
import {View, Spinner} from 'native-base';

import {Button, ScrollView, SafeAreaContainer} from 'components';

import {useInterestList} from './useInterestList';
import {useUpdateInterest} from './useUpdateInterest';
import {useUserInfo} from '../../../../hooks/useUserInfo';
import {IInterest} from '../../../../redux/user/userInterface';
import {InterestItem} from './InterestItem';

function Interests() {
  const {user} = useUserInfo();

  const {data = [], isLoading} = useInterestList();

  const [checked, setChecked] = React.useState<string[]>(
    user.interests.map(i => i.documentId),
  );

  const toggleCheck = (location: IInterest, selected: boolean) => {
    if (selected) {
      setChecked(s => [...s, location.documentId]);
    } else {
      setChecked(s => s.filter(i => i !== location.documentId));
    }
  };

  const {tryUpdateInterests, isLoading: isUpdating} = useUpdateInterest();

  const onSavePress = () => tryUpdateInterests({interestIds: checked});

  return (
    <SafeAreaContainer>
      <ScrollView>
        <View
          alignSelf="center"
          pointerEvents={isUpdating ? 'none' : 'auto'}
          width="50%">
          <View mt={2} pl={4}>
            {isLoading ? (
              <Spinner />
            ) : (
              <>
                {data.map(l => {
                  const key = `${l.documentId}${l.name}`;
                  return (
                    <InterestItem
                      isChecked={checked.includes(l.documentId)}
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

export {Interests};

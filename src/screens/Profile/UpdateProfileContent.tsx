/**
 * @format
 */
import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {HeaderLeft, HeaderTitle} from 'components';

import {RootStackParamList} from '../../navigation';
import {CardList} from './Components/CardList';
import {Location} from './Components/Location';
import {Interests} from './Components/Interests';
import {ProfileInformation} from './ProfileInformation';
import {Providers} from './Components/Providers';
import {Affiliate} from './Components/Affiliate';

type Props = NativeStackScreenProps<RootStackParamList, 'UpdateProfileContent'>;

function UpdateProfileContent(props: Props) {
  const {navigation, route} = props;
  const {content} = route.params;

  React.useLayoutEffect(() => {
    const headerLeft = () => <HeaderLeft onPress={navigation.goBack} />;
    const headerTitle = () => <HeaderTitle title={content.title} />;
    navigation.setOptions({
      headerShown: true,
      headerBackVisible: false,
      headerTitleAlign: 'center',
      headerTitle,
      headerLeft,
      headerRight: () => null,
    });
  }, [content.title, navigation]);

  const onResetPassword = () => navigation.navigate('ChangePassword');

  const onDeleteAccount = () => navigation.navigate('DeleteAccount');

  switch (content.title) {
    case 'PROFILE':
      return (
        <ProfileInformation
          onDeleteAccount={onDeleteAccount}
          onResetPassword={onResetPassword}
        />
      );
    case 'PAYMENT':
      return <CardList />;
    case 'AFFILIATE':
      return <Affiliate />;
    case 'LOCATION':
      return <Location />;
    case 'INTERESTS':
      return <Interests />;
    case 'PROVIDERS':
      return <Providers />;
    default:
      return null;
  }
}

export default UpdateProfileContent;

/**
 * @format
 */
import React from 'react';
import {Spinner} from 'native-base';
import {CommonActions} from '@react-navigation/native';

import {RootStackScreenProps} from 'navigation/DrawerNav';
import {Header, SafeAreaContainer} from 'components';

import {useUserInfo} from '../../hooks/useUserInfo';
import {storage, StorageKeys} from '../../constants';
import {useAffiliateActions} from './useAffiliateActions';
import {useBusinessInfo} from '../BusinessInformation/useBusinessInfo';

function CheckAffiliate(props: RootStackScreenProps<'CheckAffiliate'>) {
  const {navigation, route} = props;
  const {affiliateId} = route.params;

  const {user, authenticated: isLoggedIn} = useUserInfo();

  const {data, isLoading, isRefetching} = useBusinessInfo(isLoggedIn);

  const {linkAffiliate, addAffiliateClickEvent, setAffiliateDataInStorage} =
    useAffiliateActions();

  React.useEffect(() => {
    addAffiliateClickEvent(affiliateId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoggedIn = async () => {
    const isBusinessExists = data !== undefined;
    if (!isBusinessExists) {
      if (user.affiliateUserId.length === 0) {
        setAffiliateDataInStorage(affiliateId);
        const localId = storage.getString(StorageKeys.AFFILIATE_ID) ?? '';
        if (localId.length > 0) {
          await linkAffiliate(affiliateId);
        }
        gotoBusinessSignup();
      } else {
        gotoHome();
      }
    } else {
      gotoHome();
    }
  };

  const gotoHome = () => {
    console.log('going home');
    navigation.dispatch(
      CommonActions.reset({index: 1, routes: [{name: 'DrawerNav'}]}),
    );
  };

  const gotoBusinessSignup = () => {
    const params = {content: {id: '', title: 'INFORMATION'}};
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{name: 'DrawerNav'}, {name: 'BusinessInfo', params}],
      }),
    );
  };

  const goToSignup = () => {
    const params = {affiliateId};
    const routes = [{name: 'DrawerNav'}, {name: 'Signup', params}];
    navigation.dispatch(CommonActions.reset({index: 1, routes}));
  };

  const handleLoggedOut = () => {
    setAffiliateDataInStorage(affiliateId);
    goToSignup();
  };

  React.useEffect(() => {
    if (isLoading || isRefetching) {
      return;
    }
    if (isLoggedIn) {
      handleLoggedIn();
    } else {
      handleLoggedOut();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isLoggedIn, isRefetching]);

  return (
    <SafeAreaContainer edges={['top', 'bottom']}>
      <Header />
      <Spinner />
    </SafeAreaContainer>
  );
}

export default CheckAffiliate;

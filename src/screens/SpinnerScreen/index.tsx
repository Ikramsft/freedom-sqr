import React from 'react';
import {Spinner} from 'native-base';
import base64 from 'react-native-base64';
import {CommonActions} from '@react-navigation/native';

import {RootStackScreenProps} from 'navigation/DrawerNav';
import {Header, SafeAreaContainer} from 'components';

enum ShareType {
  ARTICLE = 'article',
  BUSINESS = 'business',
  PODCAST = 'podcast',
}

function MiddleScreen(props: RootStackScreenProps<'MiddleScreen'>) {
  const {navigation, route} = props;
  const {atobId} = route.params;

  React.useEffect(() => {
    if (atobId) {
      const value = base64.decode(atobId).split('/');
      navigationToDetail(value[1], value[0]);
    } else {
      navigation.dispatch(
        CommonActions.reset({index: 0, routes: [{name: 'DrawerNav'}]}),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [atobId]);

  const navigationToDetail = (id: string, type: string) => {
    switch (type) {
      case ShareType.PODCAST:
        // navigation.replace('PodcastDetail', {episodeID: id});
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              {name: 'DrawerNav'},
              {name: 'PodcastDetail', params: {episodeID: id}},
            ],
          }),
        );
        break;
      case ShareType.ARTICLE:
        // navigation.replace('ArticleDetails', {id});
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              {name: 'DrawerNav'},
              {name: 'ArticleDetails', params: {id}},
            ],
          }),
        );
        break;
      case ShareType.BUSINESS:
        // navigation.replace('BusinessSinglePost', {postId: id});
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              {name: 'DrawerNav'},
              {name: 'BusinessSinglePost', params: {postId: id}},
            ],
          }),
        );
        break;
      default:
        navigation.dispatch(
          CommonActions.reset({index: 0, routes: [{name: 'DrawerNav'}]}),
        );
        break;
    }
  };

  return (
    <SafeAreaContainer edges={['top', 'bottom']}>
      <Header />
      <Spinner />
    </SafeAreaContainer>
  );
}

export default MiddleScreen;

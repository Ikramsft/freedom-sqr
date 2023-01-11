/**
 * @format
 */
import React from 'react';
import {Linking} from 'react-native';
import {
  LinkingOptions,
  NavigationContainer,
  getStateFromPath,
} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import useAppState from 'react-native-appstate-hook';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {navigationRef} from './navigationRef';
import {getUserProfile} from '../redux/user';
import {useAppDispatch} from '../redux/store';
import {useUserInfo} from '../hooks/useUserInfo';

// Screens
import Login from '../screens/Auth/Login';
import Signup from '../screens/Auth/Signup';
import SignupSuccess from '../screens/Auth/Signup/SignupSuccess';
import UpdateProfileContent from '../screens/Profile/UpdateProfileContent';
import ChangePassword from '../screens/Profile/ChangePassword';
import ForgotPassword from '../screens/Auth/ForgotPassword';
import ResetPassword from '../screens/Auth/ResetPassword';
import BusinessInfo from '../screens/BusinessInformation';
import {ICreditCard} from '../screens/Payments/useCardForm';
import ManagePayment from '../screens/Payments';
import ForgotPasswordSuccess from '../screens/Auth/ForgotPassword/ForgotPasswordSuccess';
import ActivateAccount from '../screens/Auth/ActivateAccount';
import ArticleDetails from '../screens/ArticleDetails';
import PodcastsChannel from '../screens/PodcastsChannel';
import {ContentType} from '../screens/Profile/ProfileItem';
import LocationMap from '../screens/LocationMap';
import PodcastDetail from '../screens/PodcastDetail';
import DrawerNav from './DrawerNav';
import BusinessTab from '../screens/BusinessTab';
import BusinessList from '../screens/BusinessTab/BusinessList';
import BusinessDetail from '../screens/BusinessDetail';
import BusinessSinglePost from '../screens/BusinessSinglePost';
import {BusinessTabType} from '../screens/BusinessTab/Queries/useBusinessList';
import CreatePost from '../screens/CreatePost';
import NewsProviderWall from '../screens/NewsProviderDetail';
import {IProvider} from '../components/TimelineItem';
import {BusinessSteps} from '../screens/BusinessInformation/useBusinessInfo';
import MiddleScreen from '../screens/SpinnerScreen';
import {IAchDetails} from '../screens/Profile/Components/Affiliate/ManageAchInfo/useAchForm';
import ManageAchInfo from '../screens/Profile/Components/Affiliate/ManageAchInfo';
import {FormType, StorageKeys} from '../constants';
import CheckAffiliate from '../screens/CheckAffiliate';
import Preferences from '../screens/Following/Preferences';
import DeleteAccount from '../screens/Auth/DeleteAccount';

import {useTrackAdv} from '../hooks/useAds';

export type RootStackParamList = {
  DrawerNav: undefined;
  Home: undefined;
  News: undefined;
  Resources: undefined;
  Timeline: undefined;
  Login?: {email?: string};
  Signup: {affiliateId?: string} | undefined;
  SignupSuccess: {email: string};
  ChangePassword: undefined;
  UpdateProfileContent: {content: ContentType};
  ForgotPassword: undefined;
  ForgotPasswordSuccess: {email: string};
  ResetPassword: {token: string; email: string};
  ActivateAccount: {token: string; email: string};
  ManagePayment: {
    savedCardValues?: ICreditCard;
    formType?: FormType;
    totalCards: number;
  };
  ArticleDetails: {id: string};
  PodcastsChannel: {postProviderId: string};
  PodcastTimeline: undefined;
  LocationMap: undefined;
  BusinessTab: undefined;
  DetailsList: {heading: string};
  PodcastsPlayer: undefined;
  BusinessSinglePost: {postId: string};
  BusinessList: {heading: string; type: BusinessTabType};
  PodcastDetail: {episodeID: string};
  BusinessDetail: {businessId: string};
  CreatePost: {businessId: string};
  NewsProviderWall: {provider: IProvider};
  BusinessInfo?: {content?: ContentType; from?: string; step?: BusinessSteps};
  MiddleScreen: {atobId?: string};
  ManageAchInfo: {info?: IAchDetails} | undefined;
  CheckAffiliate: {affiliateId: string};
  WhoToFollow: undefined;
  Preference: undefined;
  DeleteAccount: undefined;
};

const prefixes: string[] = [
  'freedomsquare://',
  'https://dev.freedomsquare.com',
  'https://qa.freedomsquare.com',
  'https://prd.freedomsquare.com',
];

const linking: LinkingOptions<RootStackParamList> = {
  prefixes,

  async getInitialURL() {
    const url = await Linking.getInitialURL();
    return url;
  },

  subscribe(listener) {
    const linkingSubscription = Linking.addEventListener('url', ({url}) => {
      listener(url);
    });

    return () => {
      linkingSubscription.remove();
    };
  },

  config: {
    initialRouteName: 'DrawerNav',
    screens: {
      Login: {path: 'login'},
      Signup: {path: 'signup/:affiliateId'},
      ForgotPassword: {path: 'forgot-password'},
      ResetPassword: {path: 'reset-password/token/:token/email/:email'},
      ActivateAccount: {path: 'activate-account/token/:token/email/:email'},
      MiddleScreen: {path: 'share/:atobId'},
      CheckAffiliate: {path: 'affiliate/:affiliateId'},
      ArticleDetails: {path: 'article/:id'},
      PodcastDetail: {path: 'podcast/:episodeID'},
      PodcastsChannel: {path: 'podcast-show/:postProviderId'},
      DrawerNav: {
        screens: {
          News: 'news',
          PodcastTimeline: 'podcasts',
          BusinessTab: 'businesses',
          Resources: 'resources',
          Following: 'following',
        },
      },
    },
  },

  getStateFromPath: (path, options) => {
    if (path.includes('/signup?affiliateId=')) {
      const affiliateId = path.replace('/signup?affiliateId=', '');
      if (affiliateId && affiliateId.length > 0) {
        const newPath = `/signup/${affiliateId}`;
        return getStateFromPath(newPath, options);
      }
    }
    return getStateFromPath(path, options);
  },
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function NavContainer() {
  const {authenticated} = useUserInfo();

  const {clearAdvertisementStorageInfo} = useTrackAdv();
  const dispatch = useAppDispatch();

  const fetchProfile = () => {
    if (authenticated) {
      dispatch(getUserProfile());
    }
  };

  React.useEffect(() => {
    fetchProfile();
    clearAdvertisementStorageInfo(StorageKeys.CURRENT_D_SEQUENCE);
    clearAdvertisementStorageInfo(StorageKeys.CURRENT_SEQUENCE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useAppState({
    onForeground: () => {
      fetchProfile();
    },
  });

  return (
    <>
      <NavigationContainer linking={linking} ref={navigationRef}>
        <Stack.Navigator
          initialRouteName="DrawerNav"
          screenOptions={{headerShown: false}}>
          <Stack.Screen component={DrawerNav} name="DrawerNav" />
          <Stack.Screen
            component={BusinessInfo}
            name="BusinessInfo"
            options={{title: 'Business'}}
          />

          <Stack.Screen
            component={UpdateProfileContent}
            name="UpdateProfileContent"
          />
          <Stack.Screen component={ChangePassword} name="ChangePassword" />
          <Stack.Screen component={ManagePayment} name="ManagePayment" />
          <Stack.Screen component={Login} name="Login" />
          <Stack.Screen component={Signup} name="Signup" />
          <Stack.Screen component={SignupSuccess} name="SignupSuccess" />
          <Stack.Screen component={ForgotPassword} name="ForgotPassword" />
          <Stack.Screen
            component={ForgotPasswordSuccess}
            name="ForgotPasswordSuccess"
          />
          <Stack.Screen component={ResetPassword} name="ResetPassword" />
          <Stack.Screen component={ActivateAccount} name="ActivateAccount" />
          <Stack.Screen component={ArticleDetails} name="ArticleDetails" />
          <Stack.Screen component={PodcastsChannel} name="PodcastsChannel" />
          <Stack.Screen component={LocationMap} name="LocationMap" />
          <Stack.Screen component={PodcastDetail} name="PodcastDetail" />
          <Stack.Screen component={BusinessDetail} name="BusinessDetail" />
          <Stack.Screen component={NewsProviderWall} name="NewsProviderWall" />
          <Stack.Screen component={CreatePost} name="CreatePost" />
          <Stack.Screen
            component={BusinessSinglePost}
            name="BusinessSinglePost"
          />
          <Stack.Screen component={BusinessTab} name="BusinessTab" />
          <Stack.Screen component={BusinessList} name="BusinessList" />
          <Stack.Screen component={MiddleScreen} name="MiddleScreen" />
          <Stack.Screen component={ManageAchInfo} name="ManageAchInfo" />
          <Stack.Screen component={CheckAffiliate} name="CheckAffiliate" />
          <Stack.Screen component={Preferences} name="Preference" />
          <Stack.Screen component={DeleteAccount} name="DeleteAccount" />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
}

export default NavContainer;

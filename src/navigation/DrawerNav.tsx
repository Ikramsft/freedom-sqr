/**
 * @format
 */
import React from 'react';
import {
  createDrawerNavigator,
  DrawerNavigationProp,
  DrawerScreenProps,
} from '@react-navigation/drawer';

import {
  CompositeNavigationProp,
  CompositeScreenProps,
} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import {CustomDrawerContent} from '../components/Drawer';
import BusinessTab from '../screens/BusinessTab';
import Home from '../screens/Home';
import News from '../screens/News';
import PodcastTimeline from '../screens/PodcastTimeLine';
import Following from '../screens/Following';
import Resources from '../screens/Resources';
import Profile from '../screens/Profile';
import {RootStackParamList} from '.';
import WhoToFollow from '../screens/WhoToFollow';
import Search from '../screens/Search';

export type DrawerParamList = {
  Home: undefined;
  Following: undefined;
  News: undefined;
  BusinessTab: undefined;
  PodcastTimeline: undefined;
  Resources: undefined;
  WhoToFollow: undefined;
  PodcastsChannel: undefined;
  Profile: undefined;
  Search: undefined;
};

export type DrawerNavProps<T extends keyof DrawerParamList> =
  CompositeScreenProps<
    DrawerScreenProps<DrawerParamList, T>,
    NativeStackScreenProps<RootStackParamList>
  >;

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type RootStackNavigationProps<Screen extends keyof RootStackParamList> =
  NativeStackNavigationProp<RootStackParamList, Screen>;

export type AppNavigationType<T extends keyof DrawerParamList> =
  CompositeNavigationProp<
    DrawerNavigationProp<DrawerParamList, T>,
    NativeStackNavigationProp<RootStackParamList>
  >;

const Drawer = createDrawerNavigator<DrawerParamList>();

function DrawerNav() {
  return (
    <Drawer.Navigator
      drawerContent={CustomDrawerContent}
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: {width: '85%'},
      }}>
      <Drawer.Screen component={Home} name="Home" />
      <Drawer.Screen component={Following} name="Following" />
      <Drawer.Screen component={News} name="News" />
      <Drawer.Screen component={BusinessTab} name="BusinessTab" />
      <Drawer.Screen
        component={PodcastTimeline}
        name="PodcastTimeline"
        options={{title: 'Podcasts'}}
      />
      <Drawer.Screen
        component={Resources}
        name="Resources"
        options={{title: 'Resources'}}
      />
      <Drawer.Screen
        component={WhoToFollow}
        name="WhoToFollow"
        options={{title: 'WhoToFollow'}}
      />
      <Drawer.Screen component={Profile} name="Profile" />
      <Drawer.Screen component={Search} name="Search" />
    </Drawer.Navigator>
  );
}

export default DrawerNav;

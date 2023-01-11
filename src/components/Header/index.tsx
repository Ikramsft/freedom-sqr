/**
 * @format
 */
import React from 'react';
import {Button as NativeButton, IconButton, Text, View} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {DrawerNavigationProp} from '@react-navigation/drawer';

import LogoSVG from '../../assets/svg/logo-small.svg';
import {DrawerParamList} from '../../navigation/DrawerNav';
import {useAppTheme} from '../../theme/useTheme';
import {SafeTouchable} from '../SafeTouchable';
import {useUserInfo} from '../../hooks/useUserInfo';
import {useUserLogout} from '../../redux/user/useUserLogout';
import {push} from '../../navigation/navigationRef';
import {UserAvatar} from '../UserAvatar';

export function Header() {
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
  const {user, authenticated} = useUserInfo();

  const {tryLogoutUser} = useUserLogout();

  const {colors} = useAppTheme();

  const goHome = () => navigation.navigate('Home');

  const navToProfile = () => navigation.navigate('Profile');

  const navToSearch = () => {
    navigation.navigate('Search');
  };

  const checkLogin = () => {
    if (authenticated) {
      tryLogoutUser();
    } else {
      push('Login');
    }
  };

  const checkSignup = () => {
    if (authenticated) {
      tryLogoutUser();
    } else {
      push('Signup');
    }
  };

  return (
    <View justifyContent="center" key="common-header">
      <View
        backgroundColor={colors.brand[600]}
        flexDirection="row"
        height={60}
        justifyContent="space-between"
        width="100%">
        <View flex={1} flexDirection="row" justifyContent="center">
          <View alignItems="center" justifyContent="center">
            <IconButton
              alignItems="center"
              icon={<MaterialIcons color="white" name="menu" size={20} />}
              justifyContent="center"
              testID="DrawerIcon"
              onPress={navigation.openDrawer}
            />
          </View>
          <View alignItems="flex-start" flex={1} justifyContent="center" ml={2}>
            <SafeTouchable onPress={goHome}>
              <LogoSVG height={30} width={30} />
            </SafeTouchable>
          </View>
        </View>
        <View
          alignItems="center"
          flex={1}
          flexDirection="row"
          justifyContent="flex-end">
          {!authenticated ? (
            <>
              <View alignItems="center" justifyContent="center" mx={1}>
                <NativeButton
                  size="xs"
                  testID="header-signup-button"
                  variant="outline"
                  onPress={checkSignup}>
                  <Text color={colors.white[900]}>SIGNUP</Text>
                </NativeButton>
              </View>
              <View alignItems="center" justifyContent="center" mx={1}>
                <NativeButton
                  size="xs"
                  testID="header-login-button"
                  variant="outline"
                  onPress={checkLogin}>
                  <Text color={colors.white[900]}>LOGIN</Text>
                </NativeButton>
              </View>
            </>
          ) : null}
          <View alignItems="center" justifyContent="center" mx={1}>
            <IconButton
              icon={
                <MaterialIcons
                  color="white"
                  name="search"
                  size={20}
                  onPress={navToSearch}
                />
              }
            />
          </View>
          {authenticated ? (
            <View alignItems="center" justifyContent="center" mr={2} mx={1}>
              <SafeTouchable testID="user-avatar" onPress={navToProfile}>
                <UserAvatar profilePic={user?.croppedImageReadUrl} size={32} />
              </SafeTouchable>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

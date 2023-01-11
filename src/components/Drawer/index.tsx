/**
 * @format
 */
import React, {useMemo} from 'react';
import {isArray} from 'lodash';
import {IconButton, View} from 'native-base';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {StyleSheet} from 'react-native';
import {openInAppBrowser} from '../../utils';
import {
  FacebookIcon,
  TwitterIcon,
  TiktokIcon,
  TelegramIcon,
  InstagramIcon,
  GettrIcon,
} from '../../assets/svg';
import {useAppTheme} from '../../theme/useTheme';
import {useUserInfo} from '../../hooks/useUserInfo';
import {SafeAreaContainer} from '../SafeAreaContainer';
import {
  BusinessSetupStatus,
  IBusinessInfo,
  useBusinessInfo,
} from '../../screens/BusinessInformation/useBusinessInfo';
import {DrawerItem, IDrawerItem} from './DrawerItem';

function DrawerIcon({color, name}: {color: string; name: string}) {
  return <MaterialIcons color={color} name={name} size={20} />;
}

function SocialLinks(props: any) {
  const {iconData} = props;

  const redirectTo = () => openInAppBrowser(iconData?.link || '');
  return <IconButton icon={iconData.icon} onPress={redirectTo} />;
}

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const {navigation, state} = props;

  const theme = useAppTheme();

  const focusedRoute = state.routes[state.index]?.name;

  const {colors} = useAppTheme();

  const {authenticated} = useUserInfo();

  const {data: businessDetails = {} as IBusinessInfo} =
    useBusinessInfo(authenticated);

  const closeDrawer = () => {
    navigation.closeDrawer();
  };

  const goTo = (option: IDrawerItem) => {
    closeDrawer();
    if (option.label === 'Add Business') {
      if (authenticated) {
        navigation.navigate('BusinessInfo', {
          content: {id: '', title: 'INFORMATION'},
        });
      } else {
        navigation.navigate('Signup');
      }
    } else {
      navigation.navigate(option.routeName, option.params);
    }
  };

  const businessIcon = ({color}: {color: string}) => (
    <DrawerIcon color={color} name="add" />
  );

  const socialLinks: any[] = [
    {
      id: 1,
      label: 'gettr',
      icon: <GettrIcon height={25} width={25} />,
      link: 'https://gettr.com/user/freedomsquare',
    },
    {
      id: 2,
      label: 'instagram',
      icon: <InstagramIcon height={25} width={25} />,
      link: 'https://www.instagram.com/freedomsquareusa/',
    },
    {
      id: 3,
      label: 'facebook',
      icon: <FacebookIcon height={25} width={25} />,
      link: 'https://www.facebook.com/FreedomSquareUSA',
    },
    {
      id: 4,
      label: 'twitter',
      icon: <TwitterIcon height={25} width={25} />,
      link: 'https://twitter.com/freedomsquareus',
    },
    {
      id: 5,
      label: 'tiktok',
      icon: <TiktokIcon height={25} width={25} />,
      link: 'https://www.tiktok.com/@freedomsquareus',
    },
    {
      id: 6,
      label: 'telegram',
      icon: <TelegramIcon height={25} width={25} />,
      link: 'https://t.me/freedomsquareusa',
    },
  ];

  const section: IDrawerItem[] | void = useMemo(() => {
    const list: IDrawerItem[] = [
      {
        id: 1,
        label: 'Home',
        routeName: 'Home',
        isAuthRequired: false,
        divider: !authenticated,
      },
      {
        id: 2,
        label: 'Following',
        routeName: 'Following',
        testID: 'drawer-item-following',
        isAuthRequired: true,
        divider: true,
      },
      {
        id: 4,
        label: 'News',
        routeName: 'News',
        isAuthRequired: false,
        divider: false,
      },
      {
        id: 5,
        label: 'Podcasts',
        routeName: 'PodcastTimeline',
        isAuthRequired: false,
        divider: false,
      },
      {
        id: 6,
        label: 'Business Network',
        routeName: 'BusinessTab',
        isAuthRequired: false,
        divider: true,
      },
      {
        id: 8,
        label: 'Resources',
        routeName: 'Resources',
        isAuthRequired: false,
        divider: true,
      },
    ];

    if (businessDetails?.status === BusinessSetupStatus.APPROVED) {
      list.push({
        id: 12,
        label: 'Business Wall',
        routeName: 'BusinessDetail',
        isAuthRequired: false,
        divider: false,
        params: {
          businessId: businessDetails?.documentId,
        },
      });
    } else {
      list.push({
        id: 12,
        label: 'Add Business',
        routeName: 'Signup',
        isAuthRequired: false,
        icon: businessIcon,
        divider: false,
      });
    }
    return list;
  }, [authenticated, businessDetails]);

  const onSelect = (selectedItem: IDrawerItem, focused: boolean) => {
    if (!focused && selectedItem.routeName) {
      goTo(selectedItem);
    } else {
      closeDrawer();
    }
  };

  return (
    <SafeAreaContainer>
      <DrawerContentScrollView {...props}>
        <IconButton
          icon={
            <MaterialIcons color={colors.gray[600]} name="close" size={30} />
          }
          ml={2}
          size={50}
          onPress={closeDrawer}
        />
        <View
          backgroundColor={colors.white[900]}
          borderRadius={5}
          borderWidth={0.5}
          mx={4}
          pb={2}
          width="90%">
          {isArray(section) &&
            section.length > 0 &&
            section.map(item => {
              if (item.isAuthRequired && !authenticated) {
                return null;
              }
              const focused = focusedRoute === item.routeName;
              const key = `drawer_item_${item.label}`;
              return (
                <DrawerItem
                  focused={focused}
                  item={item}
                  key={key}
                  theme={theme}
                  onSelect={onSelect}
                />
              );
            })}
        </View>
      </DrawerContentScrollView>
      <View bgColor="brand.600" style={styles.socialLinks}>
        {socialLinks.map(item => {
          return <SocialLinks iconData={item} key={item.id} />;
        })}
      </View>
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  socialLinks: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    alignItems: 'center',
    padding: 5,
  },
});

export {CustomDrawerContent};

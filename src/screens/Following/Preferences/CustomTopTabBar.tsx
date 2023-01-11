/**
 * @format
 */
import React from 'react';
import {
  NavigationState,
  SceneRendererProps,
  TabBar,
} from 'react-native-tab-view';
import {useAppTheme} from 'theme';
import {Text} from 'native-base';

type Route = {key: string; title: string};
type State = NavigationState<Route>;

function CustomTopTabBar(props: SceneRendererProps & {navigationState: State}) {
  const {colors} = useAppTheme();

  const tabBarStyle = {
    backgroundColor: colors.white[900],
    height: 45,
  };

  const tabBarIndicatorStyle = {
    backgroundColor: colors.brand[950],
    borderRadius: 45,
  };

  return (
    <TabBar
      {...props}
      activeColor={colors.black['900']}
      inactiveColor={colors.black['300']}
      indicatorStyle={tabBarIndicatorStyle}
      renderLabel={({focused, route}) => (
        <Text
          alignSelf="center"
          color={focused ? colors.brand[950] : colors.black[900]}
          fontSize="xs"
          numberOfLines={1}
          textAlign="center"
          textTransform="capitalize"
          width="100%">
          {route.title}
        </Text>
      )}
      style={tabBarStyle}
    />
  );
}

export default CustomTopTabBar;

/**
 * @format
 */
import React from 'react';
import {View, Divider} from 'native-base';

import {AppTheme} from 'theme';
import {SafeTouchable, Title} from 'components';

export interface IDrawerItem {
  id: number;
  label: string;
  routeName: string;
  isAuthRequired: boolean;
  divider: boolean;
  icon?: ({color}: {color: string}) => JSX.Element;
  params?: Record<string, string>;
  testID?: string;
}

interface IDrawerItemProps {
  item: IDrawerItem;
  focused: boolean;
  onSelect?: (item: IDrawerItem, focused: boolean) => void;
  theme: AppTheme;
}

export function DrawerItem(props: IDrawerItemProps) {
  const {theme, focused, item, onSelect} = props;

  const onItemPress = () => onSelect?.(item, focused);

  const IconC = item.icon;
  const color = focused ? theme.colors.brand[600] : theme.colors.gray[600];
  const extraP = item.testID ? {testID: item.testID} : {};
  return (
    <SafeTouchable {...extraP} onPress={onItemPress}>
      <View key={`drawer_item_info_${item.label}`}>
        <View
          alignItems="center"
          flexDirection="row"
          justifyContent="center"
          mt={2}
          px={5}
          py={2}>
          {IconC && (
            <View
              alignItems="center"
              height={30}
              justifyContent="center"
              width={30}>
              <IconC color={color} />
            </View>
          )}
          <View
            alignItems="flex-start"
            flex={1}
            flexDirection="column"
            justifyContent="center">
            <Title fontSize="md" fontWeight={focused ? 'bold' : 'normal'}>
              {item?.label}
            </Title>
          </View>
        </View>
        {item.divider && (
          <Divider key={`divider_${String(item.id)}`} mx={4} width="90%" />
        )}
      </View>
    </SafeTouchable>
  );
}

DrawerItem.defaultProps = {
  onSelect: undefined,
};

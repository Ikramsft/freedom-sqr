import React from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import {Text, View, Image} from 'native-base';
import {IItem} from 'native-base/lib/typescript/components/composites/Typeahead/useTypeahead/types';
import Entypo from 'react-native-vector-icons/Entypo';

import {AppTheme} from 'theme';
import {SafeTouchable} from 'components';

interface ICardItemProps {
  index: number;
  item: IItem;
  theme: AppTheme;
}

export const SLIDER_WIDTH = Dimensions.get('window').width + 80;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function CardItem(cardProps: ICardItemProps) {
  const {item, index, theme} = cardProps;

  return (
    <View flexDirection="row" key={index} width={(windowWidth / 100) * 100}>
      <Image
        alt="Freedom Square"
        resizeMode="stretch"
        source={{uri: item.imgUrl}}
        width={(windowWidth / 100) * 50}
      />
      <View
        height={(windowHeight / 100) * 30}
        px={1}
        width={(windowWidth / 100) * 45}>
        <View>
          <Text alignSelf="center" fontSize={16} fontWeight="900">
            {item.heading}
          </Text>
          <Text
            alignSelf="center"
            fontSize={14}
            fontWeight="900"
            my={2}
            noOfLines={3}>
            {item.title}
          </Text>
          <Text alignSelf="center" fontSize={12} numberOfLines={3}>
            {item.body}
          </Text>
        </View>
        <View height="100%" mt={5}>
          <SafeTouchable>
            <View
              alignSelf="center"
              bg={theme.colors.red['800']}
              borderRadius={5}
              flexDirection="row"
              justifyContent="center"
              px={4}
              py={2}>
              <Text
                alignSelf="center"
                color={theme.colors.white['800']}
                fontSize={15}
                fontWeight="extraBlack">
                List New
              </Text>
              <Entypo
                color={theme.colors.white['800']}
                name="chevron-right"
                size={18}
                style={styles.icon}
              />
            </View>
          </SafeTouchable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    alignSelf: 'center',
  },
});

export default CardItem;

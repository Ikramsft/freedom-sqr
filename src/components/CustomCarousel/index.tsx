import React, {useRef, useState} from 'react';
import {View} from 'native-base';
import Carousel, {Pagination} from 'react-native-snap-carousel-v4';
import {Dimensions, StyleSheet} from 'react-native';
import {useAppTheme} from '../../theme/useTheme';
import {animatedStyles, scrollInterpolator} from '../../utils/animations';

const ASPECT_RATIO = 16 / 9;
const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 1);
const ITEM_HEIGHT = Math.round(ITEM_WIDTH / ASPECT_RATIO);

interface Props {
  data: any[];
  ItemComponent: (props: any) => React.ReactElement;
}

function CustomCarousel(props: Props) {
  const {data, ItemComponent} = props;
  const [index, setIndex] = useState(0);
  const carousel = useRef(null);

  const {colors} = useAppTheme();

  const onSnapToItem = (i: number): void => {
    setIndex(i);
  };

  return (
    <View alignItems="flex-start" flex={1} my="4">
      <Carousel
        autoplay
        loop
        autoplayDelay={500}
        autoplayInterval={3000}
        containerCustomStyle={styles.carouselContainer}
        data={data}
        inactiveSlideShift={0}
        itemHeight={ITEM_HEIGHT}
        itemWidth={ITEM_WIDTH}
        loopClonesPerSide={2}
        ref={carousel}
        renderItem={({item}) => {
          return (
            <View
              // backgroundColor={colors.blue[500]}
              style={styles.itemContainer}>
              <ItemComponent item={item} />
            </View>
          );
        }}
        scrollInterpolator={scrollInterpolator}
        slideInterpolatedStyle={animatedStyles}
        sliderWidth={SLIDER_WIDTH}
        onSnapToItem={onSnapToItem}
      />

      <Pagination
        activeDotIndex={index}
        carouselRef={carousel}
        containerStyle={styles.paginationContainer}
        dotColor="rgba(0, 0, 0, 0.92)"
        dotsLength={data.length}
        dotStyle={styles.paginationDot}
        inactiveDotColor={colors.black[500]}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
        tappableDots={!!carousel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  carouselContainer: {
    flexGrow: 0,
    marginVertical: 5,
  },
  itemContainer: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  paginationContainer: {
    paddingVertical: 8,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    padding: 0,
    marginHorizontal: 1,
  },
});

export {CustomCarousel};

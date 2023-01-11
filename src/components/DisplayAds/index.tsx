import {IAdsItem} from 'hooks/useAds';
import {Text, View} from 'native-base';
import React, {useEffect, useCallback} from 'react';
import ViewabilityTrackingView from 'react-native-viewability-tracking-view';
import {ProgressImage} from 'components/ProgressImage';
import {SafeTouchable} from '../SafeTouchable';
import {useAppTheme} from '../../theme/useTheme';

interface IDisplayAds {
  dataList: IAdsItem[] | undefined;
  adIndex: number;
  onPress: (url: string, adId: string) => void;
  handleOnImpression: (adId: string) => void;
}

function DisplayAds(props: IDisplayAds) {
  const theme = useAppTheme();

  const {dataList, adIndex, onPress, handleOnImpression} = props;
  const length = dataList?.length || 0;
  const index = adIndex / 4;
  const adNumber = index < length ? index : length - 1;
  const advData = dataList?.[adNumber];

  const [isVisible, setVisible] = React.useState<{isInView: boolean} | null>(
    null,
  );

  const onViewabilityChange = (data: any) => setVisible(data);

  const OnImpression = useCallback(() => {
    handleOnImpression?.(advData?.documentId || '');
  }, [advData?.documentId, handleOnImpression]);

  useEffect(() => {
    if (isVisible?.isInView && advData?.documentId) {
      OnImpression();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [advData?.documentId, isVisible?.isInView]);

  if (advData) {
    const onAddClick = () => onPress(advData?.url, advData?.documentId);
    return (
      <View width="100%">
        {advData.media ? (
          <ViewabilityTrackingView
            enabled
            accessibilityLabel={`Advertising banner ${advData?.documentId}`}
            testID={advData?.documentId}
            onViewabilityChange={onViewabilityChange}>
            <SafeTouchable onPress={onAddClick}>
              <View>
                <View p={5}>
                  <ProgressImage
                    borderRadius={5}
                    height={advData?.height || '200px'}
                    mt={2}
                    source={{uri: advData ? advData.media : ''}}
                    width="100%"
                  />
                </View>
              </View>
            </SafeTouchable>
          </ViewabilityTrackingView>
        ) : (
          <View bg={theme.colors.brand[600]} m={5}>
            <Text
              alignSelf="center"
              color={theme.colors.white[900]}
              fontSize={16}
              p={5}>
              {advData?.text || 'Ads Coming Soon...'}
            </Text>
          </View>
        )}
      </View>
    );
  }

  return null;
}

export default DisplayAds;

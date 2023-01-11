import {Button as BaseButton, Text, View} from 'native-base';
import React from 'react';
import {Dimensions, ImageBackground, StyleSheet} from 'react-native';

import {RootStackScreenProps} from 'navigation/DrawerNav';
import {useAppTheme} from 'theme';
import {
  Button,
  ScrollView,
  Header,
  SafeAreaContainer,
  Dropdown,
} from 'components';

import bgImage from '../../assets/images/bgImg.png';
import USAMap from './USAMap';
import usaStates from './usStates.json';

function LocationMap(props: RootStackScreenProps<'LocationMap'>) {
  const {navigation} = props;
  const theme = useAppTheme();
  const [selectedState, setSelectedState] = React.useState<{
    label: string;
    value: string;
  } | null>(null);
  const FONTSIZE = 16;
  const handleNext = () => navigation.goBack();

  const handleCancel = () => navigation.goBack();
  return (
    <SafeAreaContainer edges={['top', 'bottom']}>
      <ImageBackground resizeMode="cover" source={bgImage} style={styles.root}>
        <Header />
        <ScrollView>
          <View alignItems="center" marginTop={10}>
            <Text
              color={theme.colors.white['900']}
              fontSize={22}
              fontWeight="900"
              letterSpacing={4}>
              CUSTOMIZE YOUR
            </Text>
            <Text
              color={theme.colors.red['800']}
              fontSize={22}
              fontWeight="900"
              letterSpacing={4}>
              EXPERIENCE
            </Text>
          </View>
          <View mt={4} px={5}>
            <Dropdown
              error=""
              labelStyles={{color: theme.colors.white[900]}}
              list={usaStates}
              placeholder="SELECTED LOCATION"
              textAlign="center"
              value={selectedState?.value}
              valueStyle={{color: theme.colors.white[900], fontSize: FONTSIZE}}
              onValueChange={data => {
                const selected = usaStates.find(x => x.value === data);
                setSelectedState(selected || null);
              }}
            />
          </View>
          <View ml={2}>
            <USAMap
              selected={selectedState?.label || ''}
              onSelect={data => {
                const selected = usaStates.find(x => x.label === data);
                setSelectedState(selected || null);
              }}
            />
          </View>
          <View
            flexDirection="row"
            justifyContent="space-around"
            mt={20}
            width="100%">
            <View width="40%">
              <BaseButton
                colorScheme={theme.colors.white[900]}
                // variant={theme.colors.white[900]}
                onPress={handleCancel}>
                COMPLETE LATER
              </BaseButton>
            </View>
            <View width="40%">
              <Button loadingText="Loading" title="NEXT" onPress={handleNext} />
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  root: {
    height: Dimensions.get('screen').height,
    width: '100%',
  },
});

export default LocationMap;

/**
 * @format
 */
import React from 'react';
import {Text, View, Divider} from 'native-base';

import {useAppTheme} from 'theme';
import {TextField, Title} from 'components';

function Summary() {
  const theme = useAppTheme();
  return (
    <View alignItems="center">
      <View
        borderColor={theme.colors.gray[400]}
        borderWidth={2}
        marginTop={5}
        width="100%">
        <Title alignSelf="center" fontSize={18} my={2}>
          Summary
        </Title>
        <View marginX="5">
          <View flexDirection="row" justifyContent="space-between" my={5}>
            <Text fontWeight="medium">Local Business Listing</Text>
            <Text fontWeight="medium">$299.00</Text>
          </View>
          <TextField
            bg={theme.colors.white[800]}
            fontWeight="400"
            keyboardType="name-phone-pad"
            placeholder="Partner Code"
            placeholderTextColor={theme.colors.black[900]}
            returnKeyType="next"
            size="lg"
            textAlign="center"
          />
          <View flexDirection="row" justifyContent="space-between" my={5}>
            <Text fontWeight="600">Subtotal</Text>
            <Text fontWeight="600">$299.00</Text>
          </View>
        </View>
        <Divider height={1} my={1} />
        <View flexDirection="row" justifyContent="space-between" p={4}>
          <Text fontSize={18} fontWeight="600">
            Total
          </Text>
          <Text fontSize={18} fontWeight="600">
            $299.00
          </Text>
        </View>
      </View>
      <Divider bgColor={theme.colors.red[900]} height={1} mt={5} />
    </View>
  );
}

export default Summary;

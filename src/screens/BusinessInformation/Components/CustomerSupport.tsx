import {Text, View} from 'native-base';
import React from 'react';
import {Modal, StyleSheet, TouchableOpacity} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {useAppTheme} from 'theme';
import {Button} from 'components';

interface ICustomerSupport {
  modalRemove: () => void;
  support: boolean | 'name' | 'phone';
}

function CustomerSupport(props: ICustomerSupport) {
  const theme = useAppTheme();

  const {support, modalRemove} = props;
  return (
    <Modal transparent animationType="slide" visible={Boolean(support)}>
      <View alignItems="center" flex={1} justifyContent="center">
        <View bg={theme.colors.gray[300]} borderRadius={5} px={30} py={4}>
          <View>
            <TouchableOpacity onPress={modalRemove}>
              <Text textAlign="right">
                <AntDesign name="close" style={styles.icon} />
              </Text>
            </TouchableOpacity>
          </View>
          <Text fontSize={20} fontWeight="600" py={5} textAlign="center">
            Business Name
          </Text>
          <Text fontSize={16} fontWeight="400">
            Please contact Customer Support for assistance with editing your
            Business {support === 'name' ? 'Name' : 'Phone'}.
          </Text>
          <View mb={2} mt={5} pt={2} px={4}>
            <Button
              alignSelf="center"
              loading={false}
              title="Customer Contact Support"
              width="80%"
              onPress={modalRemove}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  icon: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CustomerSupport;

import React from 'react';
import {StyleSheet, ViewStyle} from 'react-native';
import {Icon, IInputProps, Input, View} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {useAppTheme} from 'theme';

interface ISearchProps extends IInputProps {
  placeholder?: string;
  containerStyle?: ViewStyle;
}

function SearchInput(props: ISearchProps) {
  const {colors} = useAppTheme();
  return (
    <View backgroundColor={colors.brand[600]} padding={1}>
      <View backgroundColor={colors.white[900]} style={styles.container}>
        <Input
          _focus={{borderColor: colors.white[900]}}
          bg={colors.white[900]}
          borderRadius="30"
          borderWidth="1"
          flex={1}
          fontSize="14"
          height={50}
          InputLeftElement={
            <Icon
              as={<MaterialIcons name="search" />}
              color="gray.400"
              m="2"
              ml="5"
              size="6"
            />
          }
          px="1"
          py="3"
          width="100%"
          {...props}
        />
      </View>
    </View>
  );
}

SearchInput.defaultProps = {
  placeholder: 'Search for topics and business',
  containerStyle: null,
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    borderRadius: 30,
    marginHorizontal: 15,
    marginVertical: 8,
  },
});

export default SearchInput;

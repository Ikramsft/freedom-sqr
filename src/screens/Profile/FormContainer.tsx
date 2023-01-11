import {View} from 'native-base';
import React from 'react';

import {useAppTheme} from 'theme';

interface IFormContainer {
  children: React.ReactNode;
}
function FormContainer(props: IFormContainer) {
  const {children} = props;
  const theme = useAppTheme();

  return (
    <View
      borderColor={theme.colors.gray[200]}
      borderRadius={5}
      borderWidth={2}
      mb={5}
      p={2}>
      <View
        alignItems="center"
        flexDirection="row"
        justifyContent="space-between">
        {children}
      </View>
    </View>
  );
}

export default FormContainer;

import React from 'react';
import {Text, View} from 'native-base';
import {Controller, UseFormReturn} from 'react-hook-form';

import {TextField} from 'components';

import {SocialLinks} from '../../../constants';
import {IBusinessLinksForm} from '../useBusinessLinksForm';

interface ISocialLinkComponent {
  form: UseFormReturn<IBusinessLinksForm>;
  onFieldChange: (change: (...event: any[]) => void) => (text: string) => void;
}

function SocialLinkComponent(props: ISocialLinkComponent) {
  const {form, onFieldChange} = props;
  const {control} = form;

  return (
    <>
      <View mb={3} width="100%">
        <Controller
          control={control}
          name="facebook"
          render={({field: {onChange, onBlur, value}}) => (
            <TextField
              autoCapitalize="none"
              label="Facebook URL"
              leftElement={<Text ml={2}>{SocialLinks.facebook}</Text>}
              placeholder="Username"
              returnKeyType="next"
              value={value}
              onBlur={onBlur}
              onChangeText={onFieldChange(onChange)}
            />
          )}
        />
      </View>
      <View mb={3} width="100%">
        <Controller
          control={control}
          name="instagram"
          render={({field: {onChange, onBlur, value}}) => (
            <TextField
              autoCapitalize="none"
              label="Instagram URL"
              leftElement={<Text ml={2}>{SocialLinks.instagram}</Text>}
              placeholder="Username"
              returnKeyType="next"
              value={value}
              onBlur={onBlur}
              onChangeText={onFieldChange(onChange)}
            />
          )}
        />
      </View>
      <View mb={3} width="100%">
        <Controller
          control={control}
          name="linkedin"
          render={({field: {onChange, onBlur, value}}) => (
            <TextField
              autoCapitalize="none"
              label="Linkedin URL"
              leftElement={<Text ml={2}>{SocialLinks.linkedin}</Text>}
              placeholder="Username"
              returnKeyType="next"
              value={value}
              onBlur={onBlur}
              onChangeText={onFieldChange(onChange)}
            />
          )}
        />
      </View>
      <Controller
        control={control}
        name="twitter"
        render={({field: {onChange, onBlur, value}}) => (
          <TextField
            autoCapitalize="none"
            label="Twitter URL"
            leftElement={<Text ml={2}>{SocialLinks.twitter}</Text>}
            placeholder="Username"
            returnKeyType="next"
            value={value}
            onBlur={onBlur}
            onChangeText={onFieldChange(onChange)}
          />
        )}
      />
    </>
  );
}

export default SocialLinkComponent;

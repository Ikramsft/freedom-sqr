/**
 * @format
 */
import React from 'react';
import {useTheme, View} from 'native-base';
import {IViewProps} from 'native-base/lib/typescript/components/basic/View/types';

import {StyleSheet, ViewStyle} from 'react-native';
import {ImageStyle} from 'react-native-fast-image';
import {UserIcon} from '../../assets/svg';
import {ProgressImage} from '../ProgressImage';

interface UserAvatarProps extends IViewProps {
  profilePic?: string;
  size?: number;
  influencerSize?: number;
  isRounded?: boolean;
  containerStyle?: ViewStyle;
  style?: ImageStyle;
  influencerStatus?: boolean;
}

function UserAvatar(props: UserAvatarProps) {
  const {profilePic, size, style, isRounded, ...rest} = props;

  const {colors} = useTheme();

  const roundedStyle: ImageStyle = isRounded
    ? {borderRadius: size! / 2}
    : {borderRadius: 0};

  return (
    <View>
      <View
        style={[
          styles.avatar,
          {backgroundColor: colors.white, ...roundedStyle},
        ]}
        {...rest}
        key={profilePic}>
        {profilePic && profilePic !== '' ? (
          <ProgressImage
            source={{uri: profilePic}}
            style={[
              styles.avatar,
              style,
              {height: size, width: size, ...roundedStyle},
            ]}
          />
        ) : (
          <UserIcon height={size} width={size} />
        )}
      </View>
    </View>
  );
}

UserAvatar.defaultProps = {
  size: 40,
  profilePic: '',
  isRounded: true,
  influencerSize: 13,
  style: {},
  influencerStatus: false,
  containerStyle: {},
};

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 50,
    overflow: 'hidden',
  },
});

export {UserAvatar};

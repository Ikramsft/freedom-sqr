/**
 * @format
 */
import React from 'react';
import {View} from 'native-base';
import {Controller} from 'react-hook-form';

import {RootStackScreenProps} from 'navigation/DrawerNav';
import {useAppTheme} from 'theme';
import {
  TextField,
  ScrollView,
  HeaderLeft,
  HeaderTitle,
  SafeAreaContainer,
  Title,
  UserAvatar,
} from 'components';

import {ImageComponent} from './ImageComponent';
import {IPostForm, useCreatePostForm} from './useCreatePostForm';
import {BottomBar} from './BottomBar';
import {ICreatePostRequest, useCreatePost} from './useCreatePost';
import {useUserInfo} from '../../hooks/useUserInfo';

function CreatePost(props: RootStackScreenProps<'CreatePost'>) {
  const {navigation, route} = props;

  const theme = useAppTheme();

  const {user} = useUserInfo();

  React.useLayoutEffect(() => {
    const headerLeft = () => <HeaderLeft onPress={navigation.goBack} />;
    const headerTitle = () => <HeaderTitle title="Create Post" />;
    navigation.setOptions({
      headerShown: true,
      headerBackVisible: false,
      headerTitleAlign: 'center',
      headerTitle,
      headerLeft,
      headerRight: () => null,
    });
  }, [navigation]);

  const onSuccess = (success: boolean) => {
    if (success) {
      navigation.goBack();
    }
  };

  const {tryCreatePost, isLoading} = useCreatePost(
    route.params.businessId,
    onSuccess,
  );

  const onSubmit = (values: IPostForm) => {
    const params: ICreatePostRequest = {
      contentDataType: values.mediaContent ? 'image' : 'text',
      textContent: values.textContent,
      mediaContent: values.mediaContent,
    };
    tryCreatePost(params);
  };

  const form = useCreatePostForm();
  const {control, handleSubmit, formState, setValue} = form;
  const {errors, isValid, touchedFields, dirtyFields} = formState;

  const onRemove = () => setValue('mediaContent', undefined);

  const onTextChange = (value: string) => {
    if (value.replace(/\s/g, '').length) {
      setValue('textContent', value);
    } else {
      setValue('textContent', '');
    }
  };

  let numOfLinesGrow = 5;

  return (
    <SafeAreaContainer>
      <View flex={1} mt={2}>
        <ScrollView showsHorizontalScrollIndicator={false}>
          <View
            backgroundColor={theme.colors.white[900]}
            borderColor={theme.colors.gray[400]}
            borderRadius={8}
            borderWidth={0.5}
            m={2}>
            <View alignItems="center" flexDirection="row" mt={2} pl={2}>
              <UserAvatar profilePic={user.croppedImageReadUrl} />
              <Title ml={2}>{user?.fullName ?? user.userName}</Title>
            </View>

            <View width="100%">
              <Controller
                control={control}
                name="textContent"
                render={({field: {onChange, onBlur, value}}) => (
                  <TextField
                    multiline
                    backgroundColor="transparent"
                    borderWidth={0}
                    error={
                      errors.textContent
                        ? errors.textContent.message
                        : undefined
                    }
                    maxLength={3000}
                    minHeight="150px"
                    mt={2}
                    numberOfLines={numOfLinesGrow}
                    placeholder="What are your thoughts..."
                    textAlignVertical="top"
                    value={value}
                    onChangeText={onTextChange}
                    onContentSizeChange={e => {
                      numOfLinesGrow = e.nativeEvent.contentSize.height;
                    }}
                  />
                )}
                rules={{required: true}}
              />
            </View>
          </View>

          <View width="100%">
            <Controller
              control={control}
              name="mediaContent"
              render={({field: {onChange, onBlur, value}}) => {
                if (value?.uri) {
                  return (
                    <View>
                      {value?.type.includes('image') && (
                        <ImageComponent
                          imgHeight={value?.height || 0}
                          imgWidth={value?.width || 0}
                          theme={theme}
                          uri={value?.uri}
                          onRemove={onRemove}
                        />
                      )}
                    </View>
                  );
                }
                return <View />;
              }}
              rules={{required: true}}
            />
          </View>
        </ScrollView>
        <BottomBar
          canSubmit={isValid}
          handleSubmit={handleSubmit(onSubmit)}
          isLoading={isLoading}
          setFieldValue={setValue}
          theme={theme}
        />
      </View>
    </SafeAreaContainer>
  );
}

export default CreatePost;

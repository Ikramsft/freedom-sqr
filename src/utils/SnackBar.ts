/**
 * @format
 */
import Toast, {ToastShowParams} from 'react-native-toast-message';

type ToastOptions = ToastShowParams & {message: string};

export function showSnackbar(props: ToastOptions) {
  const {type = 'success', message = 'No message', ...rest} = props;
  Toast.show({type, text1: message, visibilityTime: 6000, ...rest});
}

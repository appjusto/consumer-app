import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Application from 'expo-application';
import { nanoid } from 'nanoid/non-secure';
import { Platform } from 'react-native';

export const getInstallationId = async () => {
  let value = null;
  try {
    // https://github.com/expo/expo/issues/814
    // value = await SecureStore.getItemAsync('installation-id');
    value = await AsyncStorage.getItem('installation-id');
  } catch (e: any) {
    console.error(e);
  }
  try {
    if (!value) {
      value = Platform.OS === 'android' ? Application.getAndroidId() : nanoid();
      // await SecureStore.setItemAsync('installation-id', value);
      await AsyncStorage.setItem('installation-id', value);
    }
    return value;
  } catch (e: unknown) {
    console.error(e);
  }
  return null;
};

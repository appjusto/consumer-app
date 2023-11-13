import * as Device from 'expo-device';
import { setupChannels } from './channels';

export const setupNotifications = async () => {
  if (Device.isDevice) {
    try {
      await setupChannels();
    } catch (error: unknown) {
      console.error(error);
    }
  }
};

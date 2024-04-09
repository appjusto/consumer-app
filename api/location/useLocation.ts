import { LatLng } from '@appjusto/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

const DEFAULT_LOCATION: LatLng = { latitude: -23.541516, longitude: -46.655214 };
const KEY = 'location-enabled';

const retrieve = async () => {
  try {
    const value = await AsyncStorage.getItem(KEY);
    return value === 'true';
  } catch (error: unknown) {
    console.info(error);
  }
  return false;
};

const store = async (enabled: boolean) => {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(enabled));
  } catch (error: unknown) {
    console.info(error);
  }
};

export const useLocation = () => {
  // state
  const [location, setLocation] = useState<LatLng>(DEFAULT_LOCATION);
  const [permissionResponse, setPermissionResponse] = useState<Location.PermissionResponse>();
  const [enabled, setEnabled] = useState(false);
  // side effects
  useEffect(() => {
    if (!enabled) retrieve().then(setEnabled);
    else Location.getForegroundPermissionsAsync().then(setPermissionResponse);
  }, [enabled]);
  useEffect(() => {
    if (!enabled || !permissionResponse) {
      setLocation(DEFAULT_LOCATION);
      return;
    }
    if (permissionResponse.granted) {
      Location.getLastKnownPositionAsync().then((value) => {
        if (!value) return;
        setLocation({ latitude: value.coords.latitude, longitude: value.coords.longitude });
      });
    } else if (permissionResponse.canAskAgain) {
      Location.requestForegroundPermissionsAsync().then(setPermissionResponse);
    }
  }, [enabled, permissionResponse]);
  // result
  const granted = permissionResponse?.granted === true;
  const updateEnabled = (value: boolean) => {
    store(value).then(() => {
      setEnabled(value);
    });
  };
  return { location, granted, updateEnabled };
};

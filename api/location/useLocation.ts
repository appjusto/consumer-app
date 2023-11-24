import { LatLng } from '@appjusto/types';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

export const useLocation = () => {
  // state
  const [location, setLocation] = useState<LatLng>();
  const [permissionResponse, setPermissionResponse] = useState<Location.PermissionResponse>();
  // side effects
  useEffect(() => {
    Location.getForegroundPermissionsAsync().then(setPermissionResponse);
  }, []);
  useEffect(() => {
    if (!permissionResponse) return;
    if (permissionResponse.granted) {
      Location.getLastKnownPositionAsync().then((value) => {
        if (!value) return;
        setLocation({ latitude: value.coords.latitude, longitude: value.coords.longitude });
      });
    } else if (permissionResponse.canAskAgain) {
      Location.requestForegroundPermissionsAsync().then(setPermissionResponse);
    }
  }, [permissionResponse]);
  // result
  const granted = permissionResponse?.granted === true;
  return { location, granted };
};

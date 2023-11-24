import { getAppVersion } from '@/common/version';
import { getFirebaseRegion } from '@/extra';
import { Address, LatLng, QueryGoogleMapsPayload } from '@appjusto/types';
import firebase from '@react-native-firebase/app';
import crashlytics from '@react-native-firebase/crashlytics';

// functions
const region = getFirebaseRegion();
const queryGoogleMaps = firebase.app().functions(region).httpsCallable('queryGoogleMaps');

export default class MapsApi {
  async googlePlacesAutocomplete(input: string, sessionToken: string, coords?: LatLng) {
    const payload: QueryGoogleMapsPayload = {
      operation: 'autocomplete',
      flavor: 'consumer',
      input,
      sessionToken,
      coords,
      meta: { version: getAppVersion() },
    };
    try {
      console.info('MapsApi.googlePlacesAutocomplete: ', input, coords);
      const response = await queryGoogleMaps(payload);
      console.log(response);
      return response.data as Address[];
    } catch (error: any) {
      if (error instanceof Error) crashlytics().recordError(error);
      throw new Error('Não foi possível obter sua localização.');
    }
  }

  async googleGeocode(address: string) {
    const payload: QueryGoogleMapsPayload = {
      operation: 'geocode',
      flavor: 'consumer',
      address,
      meta: { version: getAppVersion() },
    };
    try {
      console.info('MapsApi.googleGeocode: ', address);
      const response = await queryGoogleMaps(payload);
      console.log(response);
      return response.data as LatLng;
    } catch (error: any) {
      console.info(error);
      return null;
    }
  }
  async googleReverseGeocode(coords: LatLng) {
    const payload: QueryGoogleMapsPayload = {
      operation: 'reverse-geocode',
      flavor: 'consumer',
      coords,
      meta: { version: getAppVersion() },
    };
    try {
      console.info('MapsApi.googleReverseGeocode: ', coords);
      const response = await queryGoogleMaps(payload);
      return response.data as Address;
    } catch (error: any) {
      console.info(error);
      return null;
    }
  }
}

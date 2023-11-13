import { getFirebaseRegion } from '@/extra';
import firebase from '@react-native-firebase/app';

// functions
const region = getFirebaseRegion();
const queryGoogleMaps = firebase.app().functions(region).httpsCallable('queryGoogleMaps');

export default class MapsApi {
  // async googlePlacesAutocomplete(input: string, sessionToken: string, coords?: LatLng) {
  //   const payload: QueryGoogleMapsPayload = {
  //     operation: 'autocomplete',
  //     flavor: 'consumer',
  //     input,
  //     sessionToken,
  //     coords,
  //     meta: { version: getAppVersion() },
  //   };
  //   try {
  //     console.warn('MapsApi.googlePlacesAutocomplete: ', input, coords);
  //     return (await queryGoogleMaps(payload)).data as Address[];
  //   } catch (error: any) {
  // if (error instanceof Error) crashlytics().recordError(error);
  // throw new Error('Não foi possível obter sua localização.');
  //   }
  // }
  // async googleGeocode(address: string) {
  //   const payload: QueryGoogleMapsPayload = {
  //     operation: 'geocode',
  //     flavor: 'consumer',
  //     address,
  //     meta: { version: getAppVersion() },
  //   };
  //   try {
  //     console.warn('MapsApi.googleGeocode: ', address);
  //     return (await queryGoogleMaps(payload)).data as LatLng;
  //   } catch (error: any) {
  //     console.warn(error);
  //     return null;
  //   }
  // }
  // async googleReverseGeocode(coords: LatLng) {
  //   const payload: QueryGoogleMapsPayload = {
  //     operation: 'reverse-geocode',
  //     flavor: 'consumer',
  //     coords,
  //     meta: { version: getAppVersion() },
  //   };
  //   try {
  //     console.warn('MapsApi.googleReverseGeocode: ', coords);
  //     return (await queryGoogleMaps(payload)).data as Address;
  //   } catch (error: any) {
  //     console.warn(error);
  //     return null;
  //   }
  // }
}

import firebase from '@react-native-firebase/app';
import appCheck from '@react-native-firebase/app-check';
import auth from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';
import firestore from '@react-native-firebase/firestore';
import functions, { FirebaseFunctionsTypes } from '@react-native-firebase/functions';
import storage from '@react-native-firebase/storage';
import * as Application from 'expo-application';

import { onSimulator } from '@/common/version/device';
import { getManifestExtra } from '../extra';
import AuthApi from './auth/AuthApi';
import BannerApi from './banners/BannerApi';
import BusinessApi from './business/business-api';
import ChatsApi from './chats/ChatsApi';
import ComplaintsApi from './complaints/ComplaintsApi';
import ConsumersApi from './consumer/consumers-api';
import AlgoliaApi from './externals/algolia/AlgoliaApi';
import FleetsApi from './fleets/FleetsApi';
import IncidentsApi from './incidents/IncidentsApi';
import LedgerApi from './ledger/LedgerApi';
import MapsApi from './maps/MapsApi';
import CouriersApi from './orders/courier/couriers-api';
import OrdersApi from './orders/orders-api';
import PaymentsApi from './orders/payment/payments-api';
import PlatformApi from './platform/PlatformApi';
import ProfileApi from './profile/profile-api';

const extra = getManifestExtra();

export default class Api {
  private _auth: AuthApi;
  private _platform: PlatformApi;
  private _profile: ProfileApi;
  private _consumers: ConsumersApi;
  private _couriers: CouriersApi;
  private _business: BusinessApi;
  private _banner: BannerApi;
  private _fleets: FleetsApi;
  private _algolia: AlgoliaApi;
  private _orders: OrdersApi;
  private _payments: PaymentsApi;
  private _ledger: LedgerApi;
  private _maps: MapsApi;
  private _chat: ChatsApi;
  private _incidents: IncidentsApi;
  private _complaints: ComplaintsApi;
  private functions: FirebaseFunctionsTypes.Module;

  constructor() {
    auth().languageCode = 'pt';
    // firestore().settings({ cacheSizeBytes: 1024 * 1024 * 10 });
    if (!onSimulator()) {
      const provider = appCheck().newReactNativeFirebaseAppCheckProvider();
      provider.configure({
        android: {
          provider: 'playIntegrity',
        },
        apple: {
          provider: 'appAttestWithDeviceCheckFallback',
        },
      });
      appCheck().initializeAppCheck({ provider, isTokenAutoRefreshEnabled: true });
    }
    crashlytics().setAttribute(
      'nativeApplicationVersion',
      Application.nativeApplicationVersion ?? 'null'
    );
    this.functions = firebase.app().functions(extra.firebase.region);
    if (extra.firebase.emulator.host) {
      const host = extra.firebase.emulator.host;
      auth().useEmulator(`http://${host}:9099`);
      firestore().useEmulator(host, 8080);
      functions().useEmulator(host, 5001);
      storage().useEmulator(host, 9199);
      // TODO: firebase.app().storage('gs://default-bucket')
    }
    this._auth = new AuthApi();
    this._platform = new PlatformApi(this._auth);
    this._profile = new ProfileApi(this._auth);
    this._consumers = new ConsumersApi(this._auth);
    this._couriers = new CouriersApi();
    this._business = new BusinessApi();
    this._banner = new BannerApi();
    this._fleets = new FleetsApi(this._profile);
    this._orders = new OrdersApi(this._auth);
    this._payments = new PaymentsApi(this._auth);
    this._ledger = new LedgerApi(this._auth);
    this._maps = new MapsApi();
    this._algolia = new AlgoliaApi();
    this._chat = new ChatsApi(this._auth);
    this._incidents = new IncidentsApi(this._auth);
    this._complaints = new ComplaintsApi();
  }

  auth() {
    return this._auth;
  }

  platform() {
    return this._platform;
  }

  profile() {
    return this._profile;
  }

  consumers() {
    return this._consumers;
  }

  couriers() {
    return this._couriers;
  }

  business() {
    return this._business;
  }

  banner() {
    return this._banner;
  }

  fleets() {
    return this._fleets;
  }

  orders() {
    return this._orders;
  }

  payments() {
    return this._payments;
  }

  ledger() {
    return this._ledger;
  }

  maps() {
    return this._maps;
  }

  chat() {
    return this._chat;
  }

  incidents() {
    return this._incidents;
  }

  complaints() {
    return this._complaints;
  }

  algolia() {
    return this._algolia;
  }
}

export const api = new Api();

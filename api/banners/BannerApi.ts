import { documentAs, documentsAs } from '@/common/firebase/documentAs';
import { Banner, BannersOrdering, ClientFlavor, WithId } from '@appjusto/types';
import crashlytics from '@react-native-firebase/crashlytics';
import firestore from '@react-native-firebase/firestore';

// firestore
const bannersRef = () => firestore().collection('banners');
const bannerOrderingRef = () => bannersRef().doc('ordering');
// storage
export const getBannerStoragePath = (banner: WithId<Banner>, size: string) =>
  `banners/${banner.flavor}/${banner.id}${size}.${banner.mobileImageType}`;

export default class BannerApi {
  // firestore
  observeBanners(resultHandler: (banners: WithId<Banner>[]) => void) {
    return bannersRef()
      .where('flavor', '==', 'consumer' as ClientFlavor)
      .where('enabled', '==', true)
      .onSnapshot(
        (snapshot) => {
          if (snapshot.empty) resultHandler([]);
          else resultHandler(documentsAs<Banner>(snapshot.docs));
        },
        (error) => {
          console.error(error);
          crashlytics().recordError(error);
        }
      );
  }

  observeBannersOrdering(resultHandler: (ordering: BannersOrdering | null) => void) {
    return bannerOrderingRef().onSnapshot(
      (snapshot) => {
        if (snapshot.exists) resultHandler(documentAs<BannersOrdering>(snapshot));
        else resultHandler(null);
      },
      (error) => {
        console.error(error);
        crashlytics().recordError(error);
      }
    );
  }
}

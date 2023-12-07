import { documentAs, documentsAs } from '@/common/firebase/documentAs';
import {
  BusinessMenuMessage,
  Category,
  Complement,
  ComplementGroup,
  Ordering,
  Product,
  PublicBusiness,
  WithId,
} from '@appjusto/types';
import crashlytics from '@react-native-firebase/crashlytics';
import firestore from '@react-native-firebase/firestore';

// firestore
const businessesRef = () =>
  firestore().collection('public').doc('subcollections').collection('businesses');
const businessRef = (businessId: string) => businessesRef().doc(businessId);
const businessCategoriesRef = (businessId: string) =>
  businessRef(businessId).collection('categories');
const businessProductsRef = (businessId: string) => businessRef(businessId).collection('products');
const businessProductRef = (businessId: string, productId: string) =>
  businessProductsRef(businessId).doc(productId);
const businessComplementsGroupsRef = (businessId: string) =>
  businessRef(businessId).collection('complementsgroups');
const businessComplementsRef = (businessId: string) =>
  businessRef(businessId).collection('complements');
const businessMenuRef = (businessId: string) => businessRef(businessId).collection('menu');
const businessMenuOrderingRef = (businessId: string, menuId: string = 'default') =>
  businessMenuRef(businessId).doc(menuId);
const businessMenuMessageRef = (businessId: string) => businessMenuRef(businessId).doc('message');

// storage
const getBusinessStoragePath = (businessId: string) => `businesses/${businessId}`;
export const getBusinessLogoStoragePath = (businessId: string) =>
  `${getBusinessStoragePath(businessId)}/logo_240x240.jpg`;
export const getBusinessCoverStoragePath = (businessId: string) =>
  `${getBusinessStoragePath(businessId)}/cover_1008x360.jpg`;
const getProductsStoragePath = (businessId: string) =>
  `${getBusinessStoragePath(businessId)}/products`;
export const getProductImageStoragePath = (businessId: string, productId: string, size: string) =>
  `${getProductsStoragePath(businessId)}/${productId}_${size}.jpg`;
const getComplementsStoragePath = (businessId: string) =>
  `${getBusinessStoragePath(businessId)}/complements`;
export const getComplementImageStoragePath = (businessId: string, complementId: string) =>
  `${getComplementsStoragePath(businessId)}/${complementId}_288x288.jpg`;

export default class BusinessApi {
  async fetchBusiness(value: string) {
    const r = /^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{7}$/.exec(value);
    const fieldPath = !r ? 'slug' : 'code';
    const query = businessesRef().where(fieldPath, '==', value).limit(1);
    const snapshot = await query.get();
    if (snapshot.empty) return null;
    return documentAs<PublicBusiness>(snapshot.docs[0]);
  }

  observeBusiness(businessId: string, resultHandler: (business: WithId<PublicBusiness>) => void) {
    return businessRef(businessId).onSnapshot(
      (snapshot) => {
        if (snapshot.exists) resultHandler(documentAs<PublicBusiness>(snapshot));
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // menu
  observeCategories(businessId: string, resultHandler: (categories: WithId<Category>[]) => void) {
    return businessCategoriesRef(businessId)
      .where('enabled', '==', true)
      .onSnapshot(
        (snapshot) => resultHandler(documentsAs<Category>(snapshot.docs)),
        (error) => {
          console.error(error);
          crashlytics().recordError(error);
        }
      );
  }

  observeProducts(businessId: string, resultHandler: (products: WithId<Product>[]) => void) {
    return businessProductsRef(businessId)
      .where('enabled', '==', true)
      .onSnapshot(
        (snapshot) => resultHandler(documentsAs<Product>(snapshot.docs)),
        (error) => {
          console.error(error);
          crashlytics().recordError(error);
        }
      );
  }

  observeProduct(
    businessId: string,
    productId: string,
    resultHandler: (products: WithId<Product>) => void
  ) {
    return businessProductRef(businessId, productId).onSnapshot(
      (snapshot) => resultHandler(documentAs<Product>(snapshot)),
      (error) => {
        console.error(error);
        crashlytics().recordError(error);
      }
    );
  }

  observeComplementsGroups(
    businessId: string,
    resultHandler: (products: WithId<ComplementGroup>[]) => void
  ) {
    return businessComplementsGroupsRef(businessId)
      .where('enabled', '==', true)
      .onSnapshot(
        (snapshot) => resultHandler(documentsAs<ComplementGroup>(snapshot.docs)),
        (error) => {
          console.error(error);
          crashlytics().recordError(error);
        }
      );
  }

  observeComplements(businessId: string, resultHandler: (products: WithId<Complement>[]) => void) {
    return businessComplementsRef(businessId)
      .where('enabled', '==', true)
      .onSnapshot(
        (snapshot) => resultHandler(documentsAs<Complement>(snapshot.docs)),
        (error) => {
          console.error(error);
          crashlytics().recordError(error);
        }
      );
  }

  observeMenuOrdering(
    businessId: string,
    resultHandler: (products: WithId<Ordering>) => void,
    menuId?: string
  ) {
    return businessMenuOrderingRef(businessId, menuId).onSnapshot(
      (snapshot) => resultHandler(documentAs<Ordering>(snapshot)),
      (error) => {
        console.error(error);
        crashlytics().recordError(error);
      }
    );
  }

  async fetchBusinessMenuMessage(businessId: string) {
    const snapshot = await businessMenuMessageRef(businessId).get();
    if (!snapshot.exists) return null;
    return snapshot.data() as BusinessMenuMessage;
  }
}

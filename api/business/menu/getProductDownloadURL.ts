import { Product, WithId } from '@appjusto/types';
import storage from '@react-native-firebase/storage';
import { getProductImageStoragePath } from '../BusinessApi';

export const getProductDownloadURL = (
  businessId: string,
  product: WithId<Product>,
  size = '288x288'
) => {
  if (product.imageUrls?.length) return Promise.resolve(product.imageUrls[0]);
  return storage()
    .ref(getProductImageStoragePath(businessId, product.id, size))
    .getDownloadURL();
};

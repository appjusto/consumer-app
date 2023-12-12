import { useContextApi } from '@/api/ApiContext';
import { OrderItem, Product, ProductAlgolia, WithId } from '@appjusto/types';
import storage from '@react-native-firebase/storage';
import { useEffect, useState } from 'react';
import { getProductImageStoragePath } from '../../BusinessApi';

export const useProductImageURI = (
  businessId: string | undefined,
  product: WithId<Product> | ProductAlgolia | OrderItem | undefined,
  type: 'listing' | 'detail' = 'listing'
) => {
  // context
  const api = useContextApi();
  // state
  const [productId, setProductId] = useState<string>();
  const [productURL, setProductURL] = useState<string>();
  // side effects
  useEffect(() => {
    if (!product) return;
    if ('imageUrls' in product && product.imageUrls?.length) {
      setProductURL(product.imageUrls.find(() => true)!);
    } else if ('product' in product) {
      if (product.product.imageUrl) setProductURL(product.product.imageUrl);
      else setProductId(product.product.id);
    } else if ('id' in product) {
      setProductId(product.id);
    } else {
      setProductId(product.objectID);
    }
  }, [product]);
  useEffect(() => {
    if (!businessId) return;
    if (!productId) return;
    const size = type === 'listing' ? '288x288' : '1008x720';
    storage()
      .ref(getProductImageStoragePath(businessId, productId, size))
      .getDownloadURL()
      .then((url) => {
        if (url) setProductURL(url);
      });
  }, [api, businessId, productId, type]);
  // result
  return productURL;
};

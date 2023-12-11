import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import {
  useContextBusinessProduct,
  useContextBusinessQuote,
} from '@/api/business/context/business-context';
import { Loading } from '@/common/components/views/Loading';
import { ProductDetail } from '@/common/screens/home/businesses/detail/product/product-detail';
import { useLocalSearchParams } from 'expo-router';

export default function ProductScreen() {
  // params
  const params = useLocalSearchParams<{ id: string; productId: string }>();
  const businessId = params.id;
  const productId = params.productId;
  // context
  const product = useContextBusinessProduct(productId);
  const quote = useContextBusinessQuote();
  // tracking
  useTrackScreenView('Produto', { businessId, productId });
  // logs
  console.log('quote', quote);
  // UI
  if (!product || quote === undefined) return <Loading />;
  return <ProductDetail product={product} />;
}

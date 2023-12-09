import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import {
  useContextBusiness,
  useContextBusinessProducts,
} from '@/api/business/context/business-context';
import { Loading } from '@/common/components/views/Loading';
import { MenuList } from '@/common/screens/home/menu/menu-list';
import screens from '@/common/styles/screens';
import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

export default function RestaurantScreen() {
  // params
  const params = useLocalSearchParams<{ id: string }>();
  const businessId = params.id;
  // context
  const business = useContextBusiness();
  const products = useContextBusinessProducts();
  // tracking
  useTrackScreenView('Restaurante', { businessId });
  // UI
  if (!business || !products) return <Loading />;
  return (
    <View style={{ ...screens.default }}>
      <MenuList data={products} businessId={businessId} />
    </View>
  );
}

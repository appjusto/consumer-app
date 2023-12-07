import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useBusinessMenu } from '@/api/business/menu/useBusinessMenu';
import { useObserveBusiness } from '@/api/business/useObserveBusiness';
import { Loading } from '@/common/components/views/Loading';
import { MenuList } from '@/common/screens/home/menu/menu-list';
import screens from '@/common/styles/screens';
import { Product, WithId } from '@appjusto/types';
import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

export default function RestaurantScreen() {
  // params
  const params = useLocalSearchParams<{ id: string }>();
  const businessId = params.id;
  // state
  const business = useObserveBusiness(businessId);
  const { categoriesWithProducts, loaded: productsLoaded } = useBusinessMenu(businessId);
  const data = categoriesWithProducts.reduce(
    (r, category) => [...r, category.name, ...category.items],
    [] as (string | WithId<Product>)[]
  );
  // tracking
  useTrackScreenView('Restaurante', { businessId });
  // UI
  if (!business || !productsLoaded) return <Loading />;
  return (
    <View style={{ ...screens.default }}>
      <MenuList data={data} businessId={businessId} />
    </View>
  );
}

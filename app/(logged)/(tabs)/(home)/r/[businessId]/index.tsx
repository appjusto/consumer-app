import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import {
  useContextBusiness,
  useContextBusinessProducts,
} from '@/api/business/context/business-context';
import { useContextOrder } from '@/api/orders/context/order-context';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { Loading } from '@/common/components/views/Loading';
import { CartButton } from '@/common/screens/home/businesses/detail/footer/cart-button';
import { BusinessHeader } from '@/common/screens/home/businesses/detail/header/business-header';
import { ProductListItem } from '@/common/screens/home/businesses/detail/product-list-item';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { FlashList } from '@shopify/flash-list';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Pressable, View } from 'react-native';

export default function BusinessDetailScreen() {
  // params
  const params = useLocalSearchParams<{ businessId: string }>();
  const businessId = params.businessId;
  // context
  const business = useContextBusiness();
  const products = useContextBusinessProducts();
  const quote = useContextOrder();
  const orderId = quote?.id;
  // tracking
  useTrackScreenView('Restaurante', { businessId });
  // handlers
  const productHandler = (productId: string) =>
    router.navigate({
      pathname: '/(logged)/(tabs)/(home)/r/[businessId]/p/[productId]',
      params: { businessId, productId },
    });
  const checkoutHandler = () => {
    if (!orderId) return;
    router.navigate({
      pathname: '/(logged)/checkout/[orderId]/',
      params: { orderId },
    });
  };
  // UI
  if (!business || !products || !businessId) return <Loading />;
  return (
    <View style={{ ...screens.default }}>
      <Stack.Screen options={{ title: business.name }} />
      <FlashList
        data={products}
        keyExtractor={(item) => (typeof item === 'string' ? item : item.id)}
        ListHeaderComponent={<BusinessHeader business={business} />}
        renderItem={({ item, index }) => {
          if (typeof item === 'string')
            return (
              <View style={{ marginTop: paddings.xl, marginLeft: paddings.lg }}>
                <DefaultText size="md">{item}</DefaultText>
              </View>
            );
          return (
            <Pressable onPress={() => productHandler(item.id)}>
              {({ pressed }) => <ProductListItem businessId={businessId} item={item} />}
            </Pressable>
          );
        }}
        estimatedItemSize={78}
      />
      <CartButton order={quote} variant="business" disabled={!quote} onPress={checkoutHandler} />
    </View>
  );
}

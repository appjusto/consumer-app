import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import {
  useContextBusiness,
  useContextBusinessProducts,
} from '@/api/business/context/business-context';
import { useContextOrderQuote } from '@/api/orders/context/order-context';
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
  const params = useLocalSearchParams<{ id: string }>();
  const businessId = params.id;
  // context
  const business = useContextBusiness();
  const products = useContextBusinessProducts();
  const quote = useContextOrderQuote();
  // tracking
  useTrackScreenView('Restaurante', { businessId });
  // UI
  if (!business || !products) return <Loading />;
  return (
    <View style={{ ...screens.default }}>
      <Stack.Screen options={{ title: business.name }} />
      <FlashList
        data={products}
        keyExtractor={(item) => (typeof item === 'string' ? item : item.id)}
        ListHeaderComponent={<BusinessHeader businessId={businessId} />}
        renderItem={({ item, index }) => {
          if (typeof item === 'string')
            return (
              <View style={{ marginTop: paddings.xl, marginLeft: paddings.lg }}>
                <DefaultText size="md">{item}</DefaultText>
              </View>
            );
          return (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/(logged)/(tabs)/(home)/r/[id]/p/[productId]',
                  params: { id: businessId, productId: item.id },
                })
              }
            >
              {({ pressed }) => <ProductListItem businessId={businessId} item={item} />}
            </Pressable>
          );
        }}
        estimatedItemSize={78}
      />
      <CartButton
        order={quote}
        variant="business"
        disabled={!quote}
        onPress={() =>
          router.push({
            pathname: '/(logged)/(tabs)/(home)/r/[id]/checkout/',
            params: { id: businessId },
          })
        }
      />
    </View>
  );
}

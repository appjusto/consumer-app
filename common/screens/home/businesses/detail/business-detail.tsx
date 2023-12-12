import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import {
  useContextBusiness,
  useContextBusinessProducts,
} from '@/api/business/context/business-context';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { Loading } from '@/common/components/views/Loading';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { FlashList } from '@shopify/flash-list';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Pressable, View, ViewProps } from 'react-native';
import { CartButton } from './footer/cart-button';
import { BusinessHeader } from './header/business-header';
import { ProductListItem } from './product-list-item';

interface Props extends ViewProps {}

export const BusinessDetail = ({ style, ...props }: Props) => {
  // params
  const params = useLocalSearchParams<{ id: string }>();
  const businessId = params.id;
  // tracking
  useTrackScreenView('Restaurante', { businessId });
  // UI
  // context
  const business = useContextBusiness();
  const products = useContextBusinessProducts();
  // UI
  if (!business || !products) return <Loading />;
  return (
    <View style={{ ...screens.default }}>
      <Stack.Screen options={{ title: business.name }} />
      <FlashList
        {...props}
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
      <CartButton variant="business" />
    </View>
  );
};

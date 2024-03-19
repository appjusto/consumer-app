import { useContextApi } from '@/api/ApiContext';
import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextOrder } from '@/api/orders/context/order-context';
import { isOrderEmpty } from '@/api/orders/total/isOrderEmpty';
import { LinkButton } from '@/common/components/buttons/link/LinkButton';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultInput } from '@/common/components/inputs/default/DefaultInput';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { BusinessCart } from '@/common/screens/home/businesses/checkout/business-cart';
import { EmptyCart } from '@/common/screens/home/businesses/checkout/empty-cart';
import { CartButton } from '@/common/screens/home/businesses/detail/footer/cart-button';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

export default function OrderCheckoutScreen() {
  // context
  const api = useContextApi();
  const quote = useContextOrder();
  // state
  const [additionalInfo, setAdditionalInfo] = useState('');
  // tracking
  useTrackScreenView('Checkout: sacola', { businessId: quote?.business?.id, orderId: quote?.id });
  // side effects
  // useBackWhenOrderExpires();
  // handlers
  const updateCupomHandler = () => {
    if (!quote?.id) return;
    api
      .orders()
      .updateCoupon(quote.id, 'ITAPU10')
      .then(() => {})
      .catch((error) => {
        const message =
          error instanceof Error ? error.message : 'Não foi possível adicionar o cupom.';
        console.log(message);
      });
  };
  // logs
  console.log('checkout/[orderId]/index', typeof quote, quote?.id);
  // UI
  if (!quote || isOrderEmpty(quote)) return <EmptyCart />;
  return (
    <View style={{ ...screens.default }}>
      <DefaultScrollView>
        <Stack.Screen options={{ title: 'Sua sacola' }} />
        <BusinessCart />
        <DefaultInput
          style={{ padding: paddings.lg }}
          title="Informações adicionais"
          placeholder="Adicione observações do pedido"
          value={additionalInfo}
          onChangeText={setAdditionalInfo}
        />
        {/* coupon */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: colors.neutral100,
            paddingVertical: paddings.lgg,
            paddingHorizontal: paddings.lg,
          }}
        >
          <View></View>
          <View>
            <DefaultText size="md">Cupom</DefaultText>
            <DefaultText size="sm">Adicione um cupom ao pedido</DefaultText>
          </View>
          <View>
            <LinkButton variant="ghost" onPress={updateCupomHandler}>
              Adicionar
            </LinkButton>
          </View>
        </View>
      </DefaultScrollView>
      <View style={{ flex: 1 }} />
      <CartButton
        order={quote}
        variant="products"
        disabled={!quote}
        onPress={() =>
          router.navigate({
            pathname: '/(logged)/checkout/[orderId]/delivery',
            params: { orderId: quote.id },
          })
        }
      />
    </View>
  );
}

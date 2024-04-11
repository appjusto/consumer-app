import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextOrder, useContextOrderOptions } from '@/api/orders/context/order-context';
import { isOrderEmpty } from '@/api/orders/total/isOrderEmpty';
import { LinkButton } from '@/common/components/buttons/link/LinkButton';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultInput } from '@/common/components/inputs/default/DefaultInput';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { formatCurrency } from '@/common/formatters/currency';
import { BusinessCart } from '@/common/screens/home/businesses/checkout/business-cart';
import { EmptyCart } from '@/common/screens/home/businesses/checkout/empty-cart';
import { CartButton } from '@/common/screens/home/businesses/detail/footer/cart-button';
import { CouponIcon } from '@/common/screens/orders/checkout/coupon/coupon-icon';
import { CouponModal } from '@/common/screens/orders/checkout/coupon/coupon-modal';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

export default function OrderCheckoutScreen() {
  // context
  const quote = useContextOrder();
  const { additionalInfo, setAdditionalInfo } = useContextOrderOptions() ?? {};
  // state
  const [couponModalVisible, setCouponModalVisible] = useState(false);
  // tracking
  useTrackScreenView('Checkout: sacola', { businessId: quote?.business?.id, orderId: quote?.id });
  // side effects
  // useBackWhenOrderExpires();
  // logs
  console.log('checkout/[orderId]/index', typeof quote, quote?.id);
  // UI
  if (!quote || isOrderEmpty(quote)) return <EmptyCart />;
  const coupon = quote.coupon?.discount ?? 0;
  return (
    <View style={{ ...screens.default }}>
      <DefaultScrollView>
        <Stack.Screen options={{ title: 'Sua sacola' }} />
        <CouponModal
          order={quote}
          visible={couponModalVisible}
          onCancel={() => setCouponModalVisible(false)}
        />
        <BusinessCart />
        <DefaultInput
          style={{ padding: paddings.lg }}
          inputStyle={{ minHeight: 60 }}
          title="Informações adicionais"
          placeholder="Adicione observações do pedido"
          value={additionalInfo}
          onChangeText={setAdditionalInfo}
          multiline
          textAlignVertical="top"
          blurOnSubmit
          returnKeyType="done"
        />
        {/* coupon */}
        <Pressable onPress={() => setCouponModalVisible(true)}>
          <View
            style={{
              marginHorizontal: paddings.lg,
              borderRadius: 8,
              borderColor: coupon ? colors.primary900 : colors.neutral100,
              backgroundColor: coupon ? colors.primary100 : colors.neutral100,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: paddings.lgg,
                paddingHorizontal: paddings.lg,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <CouponIcon />
                <View style={{ marginLeft: paddings.lg }}>
                  <DefaultText size="md">Cupom</DefaultText>
                  <DefaultText size="sm">
                    {coupon
                      ? `${formatCurrency(coupon)} de desconto`
                      : 'Adicione um cupom ao pedido'}
                  </DefaultText>
                </View>
              </View>
              <View>
                <LinkButton variant="ghost" onPress={() => setCouponModalVisible(true)}>
                  {coupon ? 'Trocar' : 'Adicionar'}
                </LinkButton>
              </View>
            </View>
          </View>
        </Pressable>
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

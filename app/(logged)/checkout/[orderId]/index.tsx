import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextOrder, useContextOrderOptions } from '@/api/orders/context/order-context';
import { isOrderEmpty } from '@/api/orders/total/isOrderEmpty';
import { useContextProfile } from '@/common/auth/AuthContext';
import { LinkButton } from '@/common/components/buttons/link/LinkButton';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultInput } from '@/common/components/inputs/default/DefaultInput';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { formatCurrency } from '@/common/formatters/currency';
import { isProfileValid } from '@/common/profile/isProfileValid';
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
  const order = useContextOrder();
  const profile = useContextProfile();
  const { additionalInfo, setAdditionalInfo } = useContextOrderOptions() ?? {};
  // state
  const [couponModalVisible, setCouponModalVisible] = useState(false);
  // tracking
  useTrackScreenView('Checkout: sacola', { businessId: order?.business?.id, orderId: order?.id });
  // side effects
  // useBackWhenOrderExpires();
  // handlers
  const nextHandler = () => {
    if (!order?.id) return;
    if (!isProfileValid(profile)) {
      router.navigate({
        pathname: '/(logged)/checkout/[orderId]/profile',
        params: { orderId: order.id },
      });
    } else {
      router.navigate({
        pathname: '/(logged)/checkout/[orderId]/delivery',
        params: { orderId: order.id },
      });
    }
  };
  // logs
  // console.log(coupon);
  console.log('checkout/[orderId]/index', typeof order, order?.id);
  // UI
  if (order === undefined) return null;
  else if (!order || isOrderEmpty(order)) return <EmptyCart />;
  const coupon = order.coupon;
  const couponLabel = (() => {
    if (coupon?.type === 'delivery-free') return `Entrega grátis`;
    if (coupon?.discount) {
      if (coupon.type === 'food-discount') {
        return `${formatCurrency(coupon.discount)} de desconto nos produtos`;
      }
      if (coupon.type === 'delivery-discount') {
        return `${formatCurrency(coupon.discount)} de desconto na entrega`;
      }
      return `${formatCurrency(coupon.discount)} de desconto`;
    }
    return 'Adicione um cupom ao pedido';
  })();
  return (
    <View style={{ ...screens.default }}>
      <DefaultScrollView>
        <Stack.Screen options={{ title: 'Sua sacola' }} />
        <CouponModal
          order={order}
          visible={couponModalVisible}
          onCancel={() => setCouponModalVisible(false)}
        />
        <BusinessCart order={order} />
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
                  <DefaultText size="sm">{couponLabel}</DefaultText>
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
      <CartButton order={order} variant="total-products" disabled={!order} onPress={nextHandler} />
    </View>
  );
}

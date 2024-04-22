import { useContextApi } from '@/api/ApiContext';
import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useCheckoutIssues } from '@/api/orders/checkout/useCheckoutIssues';
import { useContextOrder, useContextOrderBusiness } from '@/api/orders/context/order-context';
import { DefaultKeyboardAwareScrollView } from '@/common/components/containers/DefaultKeyboardAwareScrollView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import { HR } from '@/common/components/views/HR';
import { useShowToast } from '@/common/components/views/toast/ToastContext';
import { DeliveryAddress } from '@/common/screens/home/businesses/checkout/delivery/delivery-address';
import { FulfillmentSelector } from '@/common/screens/home/businesses/checkout/delivery/fulfillment-selector';
import { OrderFleetCourierSelector } from '@/common/screens/home/businesses/checkout/delivery/order-fleet-courier-selector';
import { PreparationMode } from '@/common/screens/home/businesses/checkout/delivery/preparation-mode';
import { RouteDetails } from '@/common/screens/home/businesses/checkout/delivery/route-details';
import { CartButton } from '@/common/screens/home/businesses/detail/footer/cart-button';
import { useUpdateOrderDestination } from '@/common/screens/orders/checkout/places/useUpdateOrderDestination';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { Fulfillment } from '@appjusto/types';
import crashlytics from '@react-native-firebase/crashlytics';
import { Stack, router } from 'expo-router';
import { isEqual } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';

export default function OrderCheckoutDeliveryScreen() {
  // context
  const quote = useContextOrder();
  const orderId = quote?.id;
  const business = useContextOrderBusiness();
  const api = useContextApi();
  const showToast = useShowToast();
  // state
  const issues = useCheckoutIssues(true, false);
  const [acceptedFulfillments, setAcceptedFulfillments] = useState<Fulfillment[]>([]);
  // tracking
  useTrackScreenView('Checkout: entrega', { businessId: quote?.business?.id, orderId: quote?.id });
  // side effects
  useUpdateOrderDestination();
  // useBackWhenOrderExpires();
  // handlers
  const updateFulfillment = useCallback(
    (fulfillment: Fulfillment) => {
      if (!orderId) return;
      api
        .orders()
        .updateOrder(orderId, { fulfillment })
        .catch((error) => {
          console.error(error);
          if (error instanceof Error) crashlytics().recordError(error);
          showToast('Não foi possível atualizar a forma de entrega. Tente novamente.', 'error');
        });
    },
    [api, orderId, showToast]
  );
  // side effects
  useEffect(() => {
    if (!quote) return;
    let accepted = acceptedFulfillments;
    if (!business?.fulfillment?.length) {
      accepted = ['delivery'];
    } else {
      accepted = business.fulfillment;
      if (quote.fulfillment && !business.fulfillment.includes(quote.fulfillment)) {
        updateFulfillment(business.fulfillment[0]);
      }
    }
    if (!isEqual(acceptedFulfillments, accepted)) setAcceptedFulfillments(accepted);
  }, [quote, business, acceptedFulfillments, updateFulfillment]);
  // handlers
  const checkoutHandler = () => {
    if (!quote) return;
    router.navigate({
      pathname: '/(logged)/checkout/[orderId]/payment',
      params: { orderId: quote.id },
    });
  };
  // logs
  console.log('checkout/[orderId]/delivery', typeof quote, quote?.id);
  // UI
  if (!quote) return null;
  return (
    <View style={{ ...screens.default }}>
      <DefaultKeyboardAwareScrollView>
        <Stack.Screen options={{ title: 'Entrega' }} />
        <DefaultView style={{ padding: paddings.lg }}>
          <FulfillmentSelector
            order={quote}
            acceptedFulfillments={acceptedFulfillments}
            onSelectFulfillment={updateFulfillment}
          />
          <DeliveryAddress order={quote} />
          <RouteDetails order={quote} />
          <HR style={{ marginBottom: paddings.xl }} />
          <PreparationMode order={quote} />
          <OrderFleetCourierSelector />
        </DefaultView>
      </DefaultKeyboardAwareScrollView>
      <View style={{ flex: 1 }} />
      <CartButton
        order={quote}
        variant="total-order"
        disabled={!quote.fare || Boolean(quote.route?.issue) || Boolean(issues.length)}
        onPress={checkoutHandler}
      />
    </View>
  );
}

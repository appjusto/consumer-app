import { Order } from '@appjusto/types';

export const getOrderDeliveryCost = (order: Order) => {
  const deliveryNetValue = order.fare?.courier?.netValue ?? 0;
  const deliveryFinancialValue =
    order.fare?.courier?.processing?.value && order.fare.courier.payee !== 'business'
      ? order.fare?.courier?.processing?.value
      : 0;
  const insurance = order.fare?.courier?.insurance ?? 0;
  const highDemandFee = order.fare?.courier?.locationFee ?? 0;
  return deliveryNetValue + deliveryFinancialValue + insurance + highDemandFee;
};

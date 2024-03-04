import { Fare, Order, WithId } from '@appjusto/types';
import { OrderOptions } from '../payment/useOrderOptions';
import { PlaceOrderOptions } from '../types';

export interface OrderContextValue {
  order?: WithId<Order> | null;
  fares?: Fare[] | undefined;
  options?: OrderOptions;
  placeOptions?: PlaceOrderOptions;
  loading?: boolean;
}

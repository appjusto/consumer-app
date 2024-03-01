import { LatLng, OrderStatus, OrderType, PlaceOrderPayloadPayment } from '@appjusto/types';

export interface ObserveOrdersOptions {
  statuses?: OrderStatus[];
  type?: OrderType;
  businessId?: string;
  from?: Date;
  to?: Date;
  limit?: number;
}

export interface PlaceOrderOptions {
  orderId: string;
  payment: PlaceOrderPayloadPayment;
  fleetId?: string;
  courierId?: string;
  coordinates?: LatLng;
  additionalInfo?: string;
  invoiceWithCPF?: boolean;
  wantToShareData?: boolean;
}

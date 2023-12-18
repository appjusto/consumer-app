import { LatLng, OrderStatus, PlaceOrderPayloadPayment } from '@appjusto/types';

export interface ObserveOrdersOptions {
  statuses?: OrderStatus[];
  businessId?: string;
  from?: Date;
  to?: Date;
  limit?: number;
}

export interface PlaceOrderOptions {
  orderId: string;
  payment: PlaceOrderPayloadPayment;
  fleetId?: string;
  coordinates?: LatLng;
  additionalInfo?: string;
  invoiceWithCPF?: boolean;
  wantToShareData?: boolean;
}

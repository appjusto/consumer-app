import { IconPixLogo } from './icons/pix-logo';
import { PaymentMethod, PaymentMethodProps } from './payment-method';

export const OrderPaymentPix = (props: PaymentMethodProps) => {
  return <PaymentMethod title="Pix" icon={<IconPixLogo />} {...props} />;
};

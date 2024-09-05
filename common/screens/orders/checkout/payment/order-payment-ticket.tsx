import { IconTicketLogo } from './icons/ticket-logo';
import { PaymentMethod, PaymentMethodProps } from './payment-method';

interface Props extends PaymentMethodProps {}

export const OrderPaymentTicket = ({ ...props }: Props) => {
  return <PaymentMethod title="Ticket Refeição" icon={<IconTicketLogo />} {...props} />;
};

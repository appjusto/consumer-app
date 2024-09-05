import { formatCurrency } from '@/common/formatters/currency';
import { IconTicketLogo } from './icons/ticket-logo';
import { PaymentMethod, PaymentMethodProps } from './payment-method';

interface Props extends PaymentMethodProps {
  balance?: number;
}

export const OrderPaymentTicket = ({ balance, ...props }: Props) => {
  return (
    <PaymentMethod
      title="Ticket Refeição"
      subtitle={balance ? `Saldo atual: ${formatCurrency(balance)}` : undefined}
      icon={<IconTicketLogo />}
      {...props}
    />
  );
};

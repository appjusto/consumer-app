import { PaymentsHandledByBusiness } from '@/api/orders/payment';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { DinersIcon } from '@/common/screens/orders/checkout/payment/icons/diners-icon';
import { EloIcon } from '@/common/screens/orders/checkout/payment/icons/elo-icon';
import { MasterCardIcon } from '@/common/screens/orders/checkout/payment/icons/mastercard-icon';
import { IconPixLogo } from '@/common/screens/orders/checkout/payment/icons/pix-logo';
import { VisaIcon } from '@/common/screens/orders/checkout/payment/icons/visa-icon';
import { VRAlimentacao } from '@/common/screens/orders/checkout/payment/icons/vr-alimentacao';
import { VRRefeicao } from '@/common/screens/orders/checkout/payment/icons/vr-refeicao';
import paddings from '@/common/styles/paddings';
import { PublicBusiness, WithId } from '@appjusto/types';
import { Banknote, CreditCard } from 'lucide-react-native';
import { View, ViewProps } from 'react-native';
import { PaymentMethodBadge } from './payment-method-badge';

interface Props extends ViewProps {
  business: WithId<PublicBusiness> | undefined | null;
}

export const BusinessAboutPayment = ({ business, style, ...props }: Props) => {
  const acceptedPaymentMethods = business?.acceptedPaymentMethods ?? [];
  const acceptsPix = acceptedPaymentMethods.includes('pix');
  const acceptsCards = acceptedPaymentMethods.includes('credit_card');
  const acceptsFoodCards =
    acceptedPaymentMethods.includes('vr-alimentação') ||
    acceptedPaymentMethods.includes('vr-refeição');
  const acceptsOfflinePayment = PaymentsHandledByBusiness.some((value) =>
    acceptedPaymentMethods.includes(value)
  );
  return (
    <View style={[{ marginTop: paddings.xl }, style]} {...props}>
      {/* pix */}
      {acceptsPix ? (
        <View style={{ marginBottom: paddings.xl }}>
          <DefaultText size="md">Pix</DefaultText>
          <PaymentMethodBadge style={{ marginTop: paddings.md }} title="Pix">
            <IconPixLogo />
          </PaymentMethodBadge>
        </View>
      ) : null}
      {/* credit cards */}
      {acceptsCards ? (
        <View style={{ marginBottom: paddings.xl }}>
          <DefaultText size="md">Crédito</DefaultText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <PaymentMethodBadge
              style={{ marginRight: paddings.md, marginTop: paddings.md }}
              title="Visa"
            >
              <VisaIcon />
            </PaymentMethodBadge>
            <PaymentMethodBadge
              style={{ marginRight: paddings.md, marginTop: paddings.md }}
              title="Mastercard"
            >
              <MasterCardIcon />
            </PaymentMethodBadge>
            <PaymentMethodBadge
              style={{ marginRight: paddings.md, marginTop: paddings.md }}
              title="Diners"
            >
              <DinersIcon />
            </PaymentMethodBadge>
            <PaymentMethodBadge style={{ marginTop: paddings.md }} title="Elo">
              <EloIcon />
            </PaymentMethodBadge>
          </View>
        </View>
      ) : null}
      {/* food cards */}
      {acceptsFoodCards ? (
        <View style={{ marginBottom: paddings.xl }}>
          <DefaultText size="md">Vale-alimentação</DefaultText>
          <View style={{ flexDirection: 'row', marginTop: paddings.md, flexWrap: 'wrap' }}>
            {acceptedPaymentMethods.includes('vr-alimentação') ? (
              <PaymentMethodBadge style={{ marginRight: paddings.md }} title="VR Alimentação">
                <VRAlimentacao />
              </PaymentMethodBadge>
            ) : null}
            {acceptedPaymentMethods.includes('vr-refeição') ? (
              <PaymentMethodBadge style={{ marginRight: paddings.md }} title="VR Refeição">
                <VRRefeicao />
              </PaymentMethodBadge>
            ) : null}
          </View>
        </View>
      ) : null}
      {/* offline */}
      {acceptsOfflinePayment ? (
        <View style={{ marginBottom: paddings.xl }}>
          <DefaultText size="md">Pagamento na entrega</DefaultText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {acceptedPaymentMethods.includes('cash') ? (
              <PaymentMethodBadge
                style={{ marginRight: paddings.md, marginTop: paddings.md }}
                title="Dinheiro"
              >
                <Banknote />
              </PaymentMethodBadge>
            ) : null}
            {acceptedPaymentMethods.includes('business-credit-card') ? (
              <PaymentMethodBadge
                style={{ marginRight: paddings.md, marginTop: paddings.md }}
                title="Cartão de crédito"
              >
                <CreditCard />
              </PaymentMethodBadge>
            ) : null}
            {acceptedPaymentMethods.includes('business-debit-card') ? (
              <PaymentMethodBadge
                style={{ marginRight: paddings.md, marginTop: paddings.md }}
                title="Cartão de débito"
              >
                <CreditCard />
              </PaymentMethodBadge>
            ) : null}
          </View>
        </View>
      ) : null}
    </View>
  );
};

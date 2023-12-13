import { DinersIcon } from '@/common/screens/orders/checkout/payment/cards/diners-icon';
import { EloIcon } from '@/common/screens/orders/checkout/payment/cards/elo-icon';
import { MasterCardIcon } from '@/common/screens/orders/checkout/payment/cards/mastercard-icon';
import { VisaIcon } from '@/common/screens/orders/checkout/payment/cards/visa-icon';
import { VRAlimentacao } from '@/common/screens/orders/checkout/payment/cards/vr-alimentacao';
import { VRRefeicao } from '@/common/screens/orders/checkout/payment/cards/vr-refeicao';
import { View, ViewProps } from 'react-native';
import { SupportedCardType } from '../../../../../../api/consumer/cards/card-type/types';

interface Props extends ViewProps {
  type: SupportedCardType | null;
}

const getCardIcon = (type: SupportedCardType | null) => {
  if (type === 'mastercard') return <MasterCardIcon />;
  if (type === 'visa') return <VisaIcon />;
  if (type === 'elo') return <EloIcon />;
  if (type === 'diners-club') return <DinersIcon />;
  if (type === 'vr-alimentação') return <VRAlimentacao />;
  if (type === 'vr-refeição') return <VRRefeicao />;
  return null;
};

export const CardIcon = ({ type, style, ...props }: Props) => {
  // logs
  console.log(type, getCardIcon(type as SupportedCardType));
  // UI
  return (
    <View style={[{}, style]} {...props}>
      {getCardIcon(type)}
    </View>
  );
};

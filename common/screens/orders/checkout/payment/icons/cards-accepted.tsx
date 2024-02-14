import { useContextPayments } from '@/api/orders/payment/context/payments-context';
import paddings from '@/common/styles/paddings';
import { View, ViewProps } from 'react-native';
import { DinersIcon } from './diners-icon';
import { EloIcon } from './elo-icon';
import { MasterCardIcon } from './mastercard-icon';
import { VisaIcon } from './visa-icon';
import { VRAlimentacao } from './vr-alimentacao';
import { VRRefeicao } from './vr-refeicao';

interface Props extends ViewProps {}

export const CardsAccepted = ({ style, ...props }: Props) => {
  const { acceptedOnOrder } = useContextPayments();
  if (!acceptedOnOrder) return null;
  return (
    <View style={[{ flexDirection: 'row' }, style]} {...props}>
      {acceptedOnOrder.includes('credit_card') ? (
        <View style={{ flexDirection: 'row' }}>
          <VisaIcon />
          <MasterCardIcon style={{ marginLeft: paddings.xs }} />
          <DinersIcon style={{ marginLeft: paddings.xs }} />
          <EloIcon style={{ marginLeft: paddings.xs }} />
        </View>
      ) : null}
      {acceptedOnOrder.includes('vr-alimentação') ? (
        <View style={{ marginLeft: acceptedOnOrder.includes('credit_card') ? paddings.xs : 0 }}>
          <VRAlimentacao />
        </View>
      ) : null}
      {acceptedOnOrder.includes('vr-refeição') ? (
        <View style={{ marginLeft: paddings.xs }}>
          <VRRefeicao />
        </View>
      ) : null}
    </View>
  );
};

import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { Wallet } from 'lucide-react-native';
import { View } from 'react-native';
import { PaymentMethod, PaymentMethodProps } from './payment-method';

export const OfflinePaymentMethod = (props: PaymentMethodProps) => {
  // UI
  return (
    <PaymentMethod
      title="Pagamento na entrega"
      icon={
        <View
          style={{
            borderRadius: 4,
            borderColor: colors.neutral100,
            borderWidth: 1,
            paddingHorizontal: paddings.md,
            paddingVertical: paddings.xs,
          }}
        >
          <Wallet size={16} color={colors.neutral800} />
        </View>
      }
      {...props}
    />
  );
};

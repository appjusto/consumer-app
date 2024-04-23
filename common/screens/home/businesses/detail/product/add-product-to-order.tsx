import { useContextProfile } from '@/common/auth/AuthContext';
import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import { QuantityButton } from '@/common/components/buttons/quantity/quantity-button';
import { HR } from '@/common/components/views/HR';
import { formatCurrency } from '@/common/formatters/currency';
import paddings from '@/common/styles/paddings';
import { router } from 'expo-router';
import { View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  quantity: number;
  total: number;
  editing?: boolean;
  disabled?: boolean;
  onSetQuantity: (quantity: number) => void;
  onAddItemToOrder: () => void;
}

export const AddProductToOrder = ({
  quantity,
  total,
  editing,
  disabled,
  style,
  onSetQuantity,
  onAddItemToOrder,
  ...props
}: Props) => {
  // context
  const profile = useContextProfile();
  // UI
  return (
    <View style={[{}, style]} {...props}>
      <HR
        style={{
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.22,
          shadowRadius: 2.22,
          elevation: 3,
        }}
      />
      {profile ? (
        <View
          style={{ padding: paddings.lg, flexDirection: 'row', justifyContent: 'space-between' }}
        >
          <QuantityButton
            quantity={quantity}
            minValue={editing ? 0 : 1}
            size={42}
            textColor="black"
            onIncrement={() => onSetQuantity(quantity + 1)}
            onDecrement={() => onSetQuantity(quantity - 1)}
          />
          <DefaultButton
            title={
              quantity > 0
                ? `${editing ? 'Atualizar' : 'Adicionar'} ${formatCurrency(total)}`
                : 'Remover'
            }
            size="lg"
            disabled={disabled}
            onPress={onAddItemToOrder}
          />
        </View>
      ) : (
        <View style={{ padding: paddings.lg }}>
          <DefaultButton title="Faça login para pedir" onPress={() => router.push('/sign-in')} />
        </View>
      )}
    </View>
  );
};

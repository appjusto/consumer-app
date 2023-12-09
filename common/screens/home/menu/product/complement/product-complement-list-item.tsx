import { useContextBusiness } from '@/api/business/context/business-context';
import { useComplementImageURI } from '@/api/business/menu/complements/useComplementImageURI';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { formatCurrency } from '@/common/formatters/currency';
import { Complement, ComplementGroup, WithId } from '@appjusto/types';
import React from 'react';
import { View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  group: WithId<ComplementGroup>;
  complement: WithId<Complement>;
  getComplementQuantity: (complementId: string) => number;
  canAddComplement: (group: WithId<ComplementGroup>) => boolean;
  onToggle: (selected: boolean) => void;
  onIncrement: () => void;
  onDecrement: () => void;
}

export const ProductComplementListItem = ({
  group,
  complement,
  getComplementQuantity,
  canAddComplement,
  onToggle,
  onIncrement,
  onDecrement,
  style,
  ...props
}: Props) => {
  // context
  const businessId = useContextBusiness()?.id;
  // state
  const imageUrl = useComplementImageURI(businessId, complement);
  // UI
  const { name, description, maximum = 1, price } = complement;
  const quantity = getComplementQuantity(complement.id);
  const canAdd = quantity < maximum && canAddComplement(group);
  const selected = quantity > 0;
  return (
    <View style={[{ flexDirection: 'row', justifyContent: 'space-between' }, style]} {...props}>
      {/* name */}
      <View>
        <DefaultText>{name}</DefaultText>
        {description ? (
          <DefaultText size="xs" color="neutral800">
            {description}
          </DefaultText>
        ) : null}
        <DefaultText size="sm" color="neutral800">
          {formatCurrency(price)}
        </DefaultText>
      </View>
    </View>
  );
};

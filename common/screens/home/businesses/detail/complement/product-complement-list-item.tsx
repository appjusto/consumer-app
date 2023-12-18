import { QuantityButton } from '@/common/components/buttons/quantity/quantity-button';
import { RadioButton } from '@/common/components/buttons/radio/radio-button';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { formatCurrency } from '@/common/formatters/currency';
import lineHeight from '@/common/styles/lineHeight';
import paddings from '@/common/styles/paddings';
import { Complement, ComplementGroup, WithId } from '@appjusto/types';
import React from 'react';
import { Pressable, View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  group: WithId<ComplementGroup>;
  complement: WithId<Complement>;
  getComplementQuantity: (complementId: string) => number;
  canAddComplement: (group: WithId<ComplementGroup>) => boolean;
  onToggle: (added: boolean) => void;
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
  // const businessId = useContextBusiness()?.id;
  // state
  // const imageUrl = useComplementImageURI(businessId, complement);
  // UI
  const { name, description, maximum = 1, price } = complement;
  const multipleChoices = maximum > 1;
  const quantity = getComplementQuantity(complement.id);
  const canAdd = quantity < maximum && canAddComplement(group);
  const added = quantity > 0;

  return (
    <View style={[{ borderWidth: 0 }, style]} {...props}>
      <Pressable
        onPress={() => {
          if (!multipleChoices) onToggle(!added);
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {/* name */}
          <View style={{ flex: 1 }}>
            <DefaultText>{name}</DefaultText>
            {description ? (
              <DefaultText
                style={{ flexWrap: 'wrap', ...lineHeight.sm }}
                size="xs"
                color="neutral800"
              >
                {description}
              </DefaultText>
            ) : null}
            {price > 0 ? (
              <DefaultText size="sm" color="neutral800">
                {formatCurrency(price)}
              </DefaultText>
            ) : null}
          </View>
          <View style={{ marginLeft: paddings.lg }}>
            {multipleChoices ? (
              <QuantityButton
                quantity={quantity}
                disabled={!canAdd}
                onIncrement={onIncrement}
                onDecrement={onDecrement}
              />
            ) : null}
            {!multipleChoices ? (
              <RadioButton
                title=""
                checked={added}
                color="neutral200"
                onPress={() => onToggle(!added)}
              />
            ) : null}
          </View>
        </View>
      </Pressable>
    </View>
  );
};

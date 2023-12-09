import { Complement, ComplementGroup, Product, WithId } from '@appjusto/types';
import { View } from 'react-native';
import { ProductComplementHeader } from './product-complement-header';
import { ProductComplementListItem } from './product-complement-list-item';

interface Props {
  product: WithId<Product>;
  getTotalComplements: (group: WithId<ComplementGroup>) => number;
  getComplementQuantity: (complementId: string) => number;
  canAddComplement: (group: WithId<ComplementGroup>) => boolean;
  onComplementToggle: (
    group: WithId<ComplementGroup>,
    complement: WithId<Complement>,
    selected: boolean
  ) => void;
  onComplementIncrement: (complementId: string) => void;
  onComplementDecrement: (complementId: string) => void;
}

export const ProductComplements = ({
  product,
  getTotalComplements,
  getComplementQuantity,
  canAddComplement,
  onComplementToggle,
  onComplementIncrement,
  onComplementDecrement,
}: Props) => {
  // UI
  if (!product.complementsEnabled) return null;
  return (
    <View>
      {product.complementsGroups?.map((group) => (
        <View key={group.id}>
          <ProductComplementHeader group={group} totalSelected={getTotalComplements(group)} />
          {group.items?.map((complement) => {
            return (
              <ProductComplementListItem
                key={complement.id}
                group={group}
                complement={complement}
                getComplementQuantity={getComplementQuantity}
                canAddComplement={(group) => canAddComplement(group)}
                onToggle={(selected) => onComplementToggle(group, complement, selected)}
                onIncrement={() =>
                  getComplementQuantity(complement.id) > 0
                    ? onComplementIncrement(complement.id)
                    : onComplementToggle(group, complement, true)
                }
                onDecrement={() =>
                  getComplementQuantity(complement.id) > 0
                    ? onComplementDecrement(complement.id)
                    : onComplementToggle(group, complement, false)
                }
              />
            );
          })}
        </View>
      ))}
    </View>
  );
};

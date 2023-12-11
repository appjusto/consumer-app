import { useContextProfile } from '@/common/auth/AuthContext';
import paddings from '@/common/styles/paddings';
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
    added: boolean
  ) => void;
  onComplementIncrement: (group: WithId<ComplementGroup>, complement: WithId<Complement>) => void;
  onComplementDecrement: (group: WithId<ComplementGroup>, complement: WithId<Complement>) => void;
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
  // context
  const profile = useContextProfile();
  // UI
  if (!profile || !product.complementsEnabled) return null;
  return (
    <View style={{ paddingHorizontal: paddings.lg, borderWidth: 0 }}>
      {product.complementsGroups?.map((group) => (
        <View style={{}} key={group.id}>
          <ProductComplementHeader group={group} totalSelected={getTotalComplements(group)} />
          <View style={{ borderWidth: 0 }}>
            {group.items?.map((complement) => {
              return (
                <ProductComplementListItem
                  style={{ paddingVertical: paddings.lg }}
                  key={complement.id}
                  group={group}
                  complement={complement}
                  getComplementQuantity={getComplementQuantity}
                  canAddComplement={(group) => canAddComplement(group)}
                  onToggle={(added) => onComplementToggle(group, complement, added)}
                  onIncrement={() => onComplementIncrement(group, complement)}
                  onDecrement={() => onComplementDecrement(group, complement)}
                />
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
};

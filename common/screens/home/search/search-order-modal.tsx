import { SearchKind, SearchOrder } from '@/api/externals/algolia/types';
import { DefaultModal } from '@/common/components/modals/default-modal';
import { ModalHandle } from '@/common/components/modals/modal-handle';
import { DefaultText } from '@/common/components/texts/DefaultText';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { ModalProps, Pressable, View } from 'react-native';

const BusinessSearchOrdering = [
  {
    order: 'distance' as SearchOrder,
    title: 'Distância',
  },
  { order: 'price' as SearchOrder, title: 'Preço' },
  { order: 'preparation-time' as SearchOrder, title: 'Tempo de preparo' },
  { order: 'average-discount' as SearchOrder, title: 'Desconto médio' },
  { order: 'reviews' as SearchOrder, title: 'Avaliações' },
  // { order: 'popularity', title: 'Popularidade' },
];

const ProductSearchOrdering = [
  {
    order: 'distance' as SearchOrder,
    title: 'Distância',
  },
  { order: 'price' as SearchOrder, title: 'Preço' },
  { order: 'popularity' as SearchOrder, title: 'Popularidade' },
];

interface Props extends ModalProps {
  order: SearchOrder;
  kind: SearchKind;
  onUpdateOrder: (filters: SearchOrder) => void;
  onDismiss: () => void;
}

export const SearchOrderModal = ({
  order,
  kind,
  visible,
  onUpdateOrder,
  onDismiss,
  ...props
}: Props) => {
  // state
  const items = kind === 'restaurant' ? BusinessSearchOrdering : ProductSearchOrdering;
  // UI
  return (
    <DefaultModal onDismiss={onDismiss} visible={visible} {...props}>
      <View
        style={{
          padding: paddings.lg,
          backgroundColor: colors.white,
        }}
      >
        <ModalHandle style={{ marginTop: paddings.xl }} />
        <DefaultText style={{ marginVertical: paddings['2xl'], textAlign: 'center' }} size="lg">
          Ordenação
        </DefaultText>
        <View style={{ marginVertical: paddings['2xl'], justifyContent: 'flex-end' }}>
          {items.map((item) => (
            <Pressable key={item.order} onPress={() => onUpdateOrder(item.order)}>
              <DefaultText
                style={{ marginBottom: paddings['2xl'], textAlign: 'center' }}
                size="md"
                color={item.order === order ? 'primary900' : 'neutral800'}
              >
                {item.title}
              </DefaultText>
            </Pressable>
          ))}
        </View>
      </View>
    </DefaultModal>
  );
};

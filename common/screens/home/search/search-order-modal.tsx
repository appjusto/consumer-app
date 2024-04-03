import { SearchOrder } from '@/api/externals/algolia/types';
import { ModalHandle } from '@/common/components/modals/modal-handle';
import { DefaultText } from '@/common/components/texts/DefaultText';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { Modal, ModalProps, Pressable, View } from 'react-native';

interface Props extends ModalProps {
  order: SearchOrder;
  onUpdateOrder: (filters: SearchOrder) => void;
  onDismiss: () => void;
}

const items = [
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

export const SearchOrderModal = ({ order, visible, onUpdateOrder, onDismiss, ...props }: Props) => {
  // state
  // handlers
  // UI
  return (
    <Modal transparent animationType="slide" visible={visible} {...props}>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
        }}
      >
        <Pressable
          style={{
            flex: 1,
          }}
          onPress={onDismiss}
        >
          <View
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0)',
            }}
          ></View>
        </Pressable>
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
      </View>
    </Modal>
  );
};
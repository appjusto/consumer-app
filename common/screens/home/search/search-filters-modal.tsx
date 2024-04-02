import { SearchFilter } from '@/api/externals/algolia/types';
import { useCuisines } from '@/api/platform/cuisines/useCuisines';
import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import { OnlyIconButton } from '@/common/components/buttons/icon/OnlyIconButton';
import { RoundedToggleButton } from '@/common/components/buttons/toggle/rounded-toggle-button';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { HorizontalSelector } from '@/common/components/containers/horizontal-selector/horizontal-selector';
import { ModalHandle } from '@/common/components/modals/modal-handle';
import { DefaultText } from '@/common/components/texts/DefaultText';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { isEqual } from 'lodash';
import { ChevronDown, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, ModalProps, Pressable, View } from 'react-native';
import {
  cuisineAdded,
  discountAdded,
  paymentAdded,
  tagAdded,
  toggleCuisine,
  toggleDiscount,
  togglePayment,
  toggleTag,
} from './functions';

interface Props extends ModalProps {
  initialFilters: SearchFilter[];
  onUpdateFilters: (filters: SearchFilter[]) => void;
  onDismiss: () => void;
}

const sections = [{ title: 'Básicos' }, { title: 'Categorias' }, { title: 'Pagamentos' }];

export const SearchFiltersModal = ({
  initialFilters,
  visible,
  onUpdateFilters,
  onDismiss,
  ...props
}: Props) => {
  // state
  const cuisines = useCuisines();
  const [filters, setFilters] = useState<SearchFilter[]>(initialFilters);
  const [selectedIndex, setSelectedIndex] = useState(0);
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
            flex: 15,
          }}
          onPress={onDismiss}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0, 0, 0, 0)',
            }}
          ></View>
        </Pressable>
        <View
          style={{
            flex: 85,
            padding: paddings.lg,
            backgroundColor: colors.white,
          }}
        >
          <ModalHandle style={{ marginTop: paddings.xl }} />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: paddings.xl,
            }}
          >
            <OnlyIconButton
              style={{ borderWidth: 0 }}
              icon={<ChevronDown size={24} color={colors.black} />}
              onPress={onDismiss}
            />
            <DefaultText size="lg">Filtros</DefaultText>
            <OnlyIconButton
              style={{ borderWidth: 0 }}
              icon={<Trash2 size={24} color={colors.error500} />}
              onPress={() => setFilters([])}
            />
          </View>
          <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
            <HorizontalSelector
              style={{
                marginTop: paddings['2xl'],
                borderWidth: 0,
              }}
              data={sections}
              selectedIndex={selectedIndex}
              onSelect={setSelectedIndex}
            />
          </View>
          <DefaultScrollView>
            <View style={{ marginTop: paddings['2xl'] }}>
              {/* basic */}
              {selectedIndex === 0 ? (
                <View>
                  {/* discounts */}
                  <DefaultText size="md">Descontos</DefaultText>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    <RoundedToggleButton
                      style={{ marginTop: paddings.sm, marginRight: paddings.sm }}
                      title="Só no appjusto"
                      onPress={() => setFilters((current) => toggleTag(current, 'appjusto-only'))}
                      toggled={tagAdded(filters, 'appjusto-only')}
                    />
                    <RoundedToggleButton
                      style={{ marginTop: paddings.sm, marginRight: paddings.sm }}
                      title="10% de desconto"
                      onPress={() => setFilters((current) => toggleDiscount(current, '10'))}
                      toggled={discountAdded(filters, '10')}
                    />
                    <RoundedToggleButton
                      style={{ marginTop: paddings.sm, marginRight: paddings.sm }}
                      title="15% de desconto"
                      onPress={() => setFilters((current) => toggleDiscount(current, '15'))}
                      toggled={discountAdded(filters, '15')}
                    />
                    <RoundedToggleButton
                      style={{ marginTop: paddings.sm, marginRight: paddings.sm }}
                      title="20% de desconto"
                      onPress={() => setFilters((current) => toggleDiscount(current, '15'))}
                      toggled={discountAdded(filters, '15')}
                    />
                  </View>
                </View>
              ) : null}
              {/* cuisines */}
              {selectedIndex === 1 ? (
                <View>
                  <DefaultText size="md">Categorias</DefaultText>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {cuisines?.map((cuisine) => (
                      <RoundedToggleButton
                        key={cuisine.id}
                        style={{ marginTop: paddings.sm, marginRight: paddings.sm }}
                        title={cuisine.name}
                        onPress={() =>
                          setFilters((current) => toggleCuisine(current, cuisine.name))
                        }
                        toggled={cuisineAdded(filters, cuisine.name)}
                      />
                    ))}
                  </View>
                </View>
              ) : null}
              {/* payment methods */}
              {selectedIndex === 2 ? (
                <View>
                  <DefaultText size="md">Pagamento pelo app</DefaultText>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    <RoundedToggleButton
                      style={{ marginTop: paddings.sm, marginRight: paddings.sm }}
                      title="PIX"
                      onPress={() => setFilters((current) => togglePayment(current, 'pix'))}
                      toggled={paymentAdded(filters, 'pix')}
                    />
                    <RoundedToggleButton
                      style={{ marginTop: paddings.sm, marginRight: paddings.sm }}
                      title="Cartão de crédito"
                      onPress={() => setFilters((current) => togglePayment(current, 'credit_card'))}
                      toggled={paymentAdded(filters, 'credit_card')}
                    />
                    <RoundedToggleButton
                      style={{ marginTop: paddings.sm, marginRight: paddings.sm }}
                      title="VR Alimentação"
                      onPress={() =>
                        setFilters((current) => togglePayment(current, 'vr-alimentação'))
                      }
                      toggled={paymentAdded(filters, 'vr-alimentação')}
                    />
                    <RoundedToggleButton
                      style={{ marginTop: paddings.sm, marginRight: paddings.sm }}
                      title="VR Refeição"
                      onPress={() => setFilters((current) => togglePayment(current, 'vr-refeição'))}
                      toggled={paymentAdded(filters, 'vr-refeição')}
                    />
                  </View>
                  <DefaultText style={{ marginTop: paddings['2xl'] }} size="md">
                    Pagamento na entrega
                  </DefaultText>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    <RoundedToggleButton
                      style={{ marginTop: paddings.sm, marginRight: paddings.sm }}
                      title="Dinheiro"
                      onPress={() => setFilters((current) => togglePayment(current, 'cash'))}
                      toggled={paymentAdded(filters, 'cash')}
                    />
                    <RoundedToggleButton
                      style={{ marginTop: paddings.sm, marginRight: paddings.sm }}
                      title="Cartão de crédito"
                      onPress={() =>
                        setFilters((current) => togglePayment(current, 'business-credit-card'))
                      }
                      toggled={paymentAdded(filters, 'business-credit-card')}
                    />
                    <RoundedToggleButton
                      style={{ marginTop: paddings.sm, marginRight: paddings.sm }}
                      title="Cartão de débito"
                      onPress={() =>
                        setFilters((current) => togglePayment(current, 'business-debit-card'))
                      }
                      toggled={paymentAdded(filters, 'business-debit-card')}
                    />
                  </View>
                </View>
              ) : null}
            </View>
          </DefaultScrollView>
          <View style={{ flex: 1 }} />
          <DefaultButton
            style={{ marginVertical: paddings['2xl'] }}
            title="Aplicar filtros"
            disabled={isEqual(filters, initialFilters)}
            onPress={() => onUpdateFilters(filters)}
          />
        </View>
      </View>
    </Modal>
  );
};

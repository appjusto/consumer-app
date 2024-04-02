import { RoundedToggleButton } from '@/common/components/buttons/toggle/rounded-toggle-button';
import { DefaultInput } from '@/common/components/inputs/default/DefaultInput';
import { DefaultText } from '@/common/components/texts/DefaultText';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { ChevronDown, Search } from 'lucide-react-native';
import { Pressable, View, ViewProps } from 'react-native';
import { FiltersButton } from '../../search/filters-button';

export type SearchMode = 'stub' | 'in-place';

interface Props extends ViewProps {
  showFiltersModal: () => void;
  showOrderModal: () => void;
  searchMode: SearchMode;
  query?: string;
  setQuery?: (value: string) => void;
  openSearch?: () => void;
}

export const SearchHeader = ({
  showFiltersModal,
  showOrderModal,
  searchMode,
  query,
  setQuery,
  openSearch,
  style,
  ...props
}: Props) => {
  return (
    <View style={[{}, style]} {...props}>
      {searchMode === 'in-place' && setQuery ? (
        <DefaultInput placeholder="Pesquisa" value={query} onChangeText={setQuery} />
      ) : (
        <DefaultText size="lg">Restaurantes</DefaultText>
      )}
      <View
        style={{
          marginVertical: searchMode === 'stub' ? paddings.sm : paddings.lg,
          flexDirection: 'row',
        }}
      >
        {searchMode === 'stub' ? (
          <View style={{ marginRight: paddings.lg }}>
            <Pressable onPress={openSearch}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: paddings.lg,
                  paddingVertical: paddings.md,
                  borderRadius: 4,
                  borderColor: colors.neutral200,
                  borderWidth: 1,
                }}
              >
                <DefaultText style={{ marginRight: paddings['2xl'] }} size="md" color="neutral700">
                  Buscar
                </DefaultText>
                <Search size={20} color={colors.neutral800} />
              </View>
            </Pressable>
          </View>
        ) : null}
        <FiltersButton style={{ marginRight: paddings.sm }} onPress={showFiltersModal} />
        <RoundedToggleButton
          title="Ordenação"
          toggled={false}
          onPress={showOrderModal}
          rightView={
            <ChevronDown style={{ marginLeft: paddings.sm }} size={16} color={colors.neutral900} />
          }
          {...props}
        />
      </View>
    </View>
  );
};

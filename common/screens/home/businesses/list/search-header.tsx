import { SearchFilter, SearchKind } from '@/api/externals/algolia/types';
import { RoundedToggleButton } from '@/common/components/buttons/toggle/rounded-toggle-button';
import { HorizontalSelector } from '@/common/components/containers/horizontal-selector/horizontal-selector';
import { DefaultInput } from '@/common/components/inputs/default/DefaultInput';
import { DefaultText } from '@/common/components/texts/DefaultText';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { ChevronDown, Search } from 'lucide-react-native';
import { Pressable, ScrollView, View, ViewProps } from 'react-native';
import { FiltersButton } from '../../search/filters-button';

export type SearchMode = 'stub' | 'in-place';

const AboutSections = [
  { title: 'Lojas', kind: 'restaurant' as SearchKind },
  { title: 'Produtos', kind: 'product' as SearchKind },
];
interface Props extends ViewProps {
  showFiltersModal: () => void;
  showOrderModal: () => void;
  searchMode: SearchMode;
  query?: string;
  setQuery?: (value: string) => void;
  kind?: SearchKind;
  setKind?: (value: SearchKind) => void;
  openSearch?: () => void;
  filters?: SearchFilter[];
}

export const SearchHeader = ({
  showFiltersModal,
  showOrderModal,
  searchMode,
  query,
  setQuery,
  kind,
  setKind,
  openSearch,
  filters,
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
      {searchMode === 'in-place' ? (
        <HorizontalSelector
          style={{ marginVertical: paddings.lg }}
          data={AboutSections}
          selectedIndex={AboutSections.findIndex((item) => kind === item.kind)}
          onSelect={(index) => {
            if (!setKind) return;
            setKind(AboutSections[index].kind);
          }}
        />
      ) : null}
      <View
        style={{
          marginVertical: searchMode === 'stub' ? paddings.sm : paddings.lg,
        }}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
                  <DefaultText
                    style={{ marginRight: paddings['2xl'] }}
                    size="md"
                    color="neutral700"
                  >
                    Buscar
                  </DefaultText>
                  <Search size={20} color={colors.neutral800} />
                </View>
              </Pressable>
            </View>
          ) : null}
          <FiltersButton
            total={filters?.length ?? 0}
            style={{ marginRight: paddings.sm }}
            onPress={showFiltersModal}
          />
          <RoundedToggleButton
            title="Ordenação"
            toggled={false}
            onPress={showOrderModal}
            rightView={
              <ChevronDown
                style={{ marginLeft: paddings.sm }}
                size={16}
                color={colors.neutral900}
              />
            }
            {...props}
          />
        </ScrollView>
      </View>
    </View>
  );
};

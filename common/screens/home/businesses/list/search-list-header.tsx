import { SearchFilter, SearchKind } from '@/api/externals/algolia/types';
import paddings from '@/common/styles/paddings';
import { View, ViewProps } from 'react-native';
import { OngoingOrders } from '../../../orders/ongoing-orders/home-ongoing-orders';
import { BannerList } from '../../banners/banner-list';
import { CuisineList } from '../../cuisine/cuisine-list';
import { SearchHeader } from './search-header';

export type SearchListMode = 'home' | 'search';

interface Props extends ViewProps {
  mode: SearchListMode;
  showFiltersModal: () => void;
  showOrderModal: () => void;
  openSearch?: () => void;
  query?: string;
  setQuery?: (value: string) => void;
  kind?: SearchKind;
  setKind?: (value: SearchKind) => void;
  filters?: SearchFilter[];
}

export const SearchListHeader = ({
  mode,
  showFiltersModal,
  showOrderModal,
  openSearch,
  query,
  setQuery,
  kind,
  setKind,
  filters,
  style,
  ...props
}: Props) => {
  // UI
  return (
    <View style={[{}, style]} {...props}>
      {mode === 'home' ? (
        <CuisineList style={{ marginVertical: paddings.xl, marginLeft: paddings.lg }} />
      ) : null}
      {mode === 'home' ? (
        <BannerList style={{ marginBottom: paddings.lg, marginLeft: paddings.lg }} />
      ) : null}
      {mode === 'home' ? <OngoingOrders type="food" /> : null}
      <SearchHeader
        style={mode === 'home' ? { marginLeft: paddings.lg } : {}}
        showFiltersModal={showFiltersModal}
        showOrderModal={showOrderModal}
        openSearch={openSearch}
        searchMode={mode === 'home' ? 'stub' : 'in-place'}
        query={query}
        setQuery={setQuery}
        kind={kind}
        setKind={setKind}
        filters={filters}
      />
    </View>
  );
};

import paddings from '@/common/styles/paddings';
import { View, ViewProps } from 'react-native';
import { BannerList } from '../../banners/banner-list';
import { CuisineList } from '../../cuisine/cuisine-list';
import { HomeOngoingOrders } from '../../ongoing-orders/home-ongoing-orders';
import { SearchHeader } from './search-header';

// SearchListHeader

export type SearchListMode = 'home' | 'search';

interface Props extends ViewProps {
  mode: SearchListMode;
  showFiltersModal: () => void;
  showOrderModal: () => void;
  openSearch?: () => void;
  query?: string;
  setQuery?: (value: string) => void;
}

export const BusinessListHeader = ({
  mode,
  showFiltersModal,
  showOrderModal,
  openSearch,
  query,
  setQuery,
  style,
  ...props
}: Props) => {
  return (
    <View style={[{}, style]} {...props}>
      {mode === 'home' ? (
        <CuisineList style={{ marginVertical: paddings.xl, marginLeft: paddings.lg }} />
      ) : null}
      {mode === 'home' ? (
        <BannerList style={{ marginBottom: paddings.lg, marginLeft: paddings.lg }} />
      ) : null}
      {mode === 'home' ? <HomeOngoingOrders /> : null}
      <SearchHeader
        style={mode === 'home' ? { marginLeft: paddings.lg } : {}}
        showFiltersModal={showFiltersModal}
        showOrderModal={showOrderModal}
        openSearch={openSearch}
        searchMode={mode === 'home' ? 'stub' : 'in-place'}
        query={query}
        setQuery={setQuery}
      />
    </View>
  );
};

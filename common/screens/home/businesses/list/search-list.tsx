import { filtersFromParams } from '@/api/externals/algolia/filtersFromParams';
import { groupProducts } from '@/api/externals/algolia/groupProducts';
import { SearchFilter, SearchKind, SearchOrder } from '@/api/externals/algolia/types';
import { useAlgoliaSearch } from '@/api/externals/algolia/useAlgoliaSearch';
import { useContextCurrentLocation } from '@/api/preferences/context/PreferencesContext';
import { useInitialState } from '@/common/react/useInitialState';
import { BusinessAlgolia, ProductAlgolia } from '@appjusto/types';
import { FlashList } from '@shopify/flash-list';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ViewProps } from 'react-native';
import { SearchFiltersModal } from '../../search/search-filters-modal';
import { SearchOrderModal } from '../../search/search-order-modal';
import { SearchBusinessListItem } from './business-list-item/search-business-list-item';
import { SearchGroupedProductsListItem } from './business-list-item/search-grouped-products-list-item';
import { SearchListHeader, SearchListMode } from './search-list-header';

interface Props extends ViewProps {
  mode: SearchListMode;
}

export const SearchList = ({ style, mode, children, ...props }: Props) => {
  // context
  const location = useContextCurrentLocation();
  // state
  const [kind, setKind] = useState<SearchKind>('restaurant');
  const [order, setOrder] = useState<SearchOrder>('distance');
  const initialFilters = useInitialState(
    filtersFromParams(useLocalSearchParams())
  ) as SearchFilter[];
  const [filters, setFilters] = useState<SearchFilter[]>(initialFilters);
  const [filtersModalShown, setFiltersModalShown] = useState(false);
  const [orderModalShown, setOrderModalShown] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState('');
  const enabled = mode === 'home' || query.length >= 3 || filters.length > 0;
  const { results, refetch } = useAlgoliaSearch<BusinessAlgolia | ProductAlgolia>(
    enabled,
    kind,
    order,
    filters,
    location,
    query
  );
  const [products, setProducts] = useState<ProductAlgolia[][]>();
  // side effects
  useEffect(() => {
    setOrder('distance');
  }, [kind]);
  useEffect(() => {
    if (!results) return;
    if (kind === 'product') setProducts(groupProducts(results as ProductAlgolia[]));
  }, [results, kind]);
  // handlers
  const searchHandler = () => {
    router.navigate('/(logged)/(tabs)/(home)/search');
  };
  // logs
  // console.log(query);
  // console.log(mode, filters, enabled);
  console.log('SearchList', filters);
  // UI
  return (
    <View style={{ flex: 1 }}>
      <SearchFiltersModal
        initialFilters={filters}
        visible={filtersModalShown}
        onDismiss={() => setFiltersModalShown(false)}
        onUpdateFilters={(value) => {
          setFilters(value);
          setFiltersModalShown(false);
        }}
      />
      <SearchOrderModal
        order={order}
        visible={orderModalShown}
        onDismiss={() => setOrderModalShown(false)}
        onUpdateOrder={(value) => {
          setOrder(value);
          setOrderModalShown(false);
        }}
      />
      {/*  */}
      {kind === 'restaurant' ? (
        <FlashList
          {...props}
          keyExtractor={(item) => item.objectID}
          data={results}
          onRefresh={() => {
            setRefreshing(true);
            refetch()?.then(() => {
              setRefreshing(false);
            });
          }}
          ListHeaderComponent={
            <SearchListHeader
              openSearch={searchHandler}
              showFiltersModal={() => setFiltersModalShown(true)}
              showOrderModal={() => setOrderModalShown(true)}
              mode={mode}
              query={query}
              setQuery={setQuery}
              kind={kind}
              setKind={setKind}
              filters={filters}
            />
          }
          refreshing={refreshing}
          renderItem={({ item, index }) => (
            <SearchBusinessListItem
              business={item as BusinessAlgolia}
              recyclingKey={item.objectID}
              // breaks recycling but it's okay with this list
              key={item.objectID}
            />
          )}
          estimatedItemSize={78}
        />
      ) : null}
      {kind === 'product' ? (
        <FlashList
          {...props}
          keyExtractor={(item) => item[0].objectID}
          data={products}
          onRefresh={() => {
            setRefreshing(true);
            refetch()?.then(() => {
              setRefreshing(false);
            });
          }}
          ListHeaderComponent={
            <SearchListHeader
              openSearch={searchHandler}
              showFiltersModal={() => setFiltersModalShown(true)}
              showOrderModal={() => setOrderModalShown(true)}
              mode={mode}
              query={query}
              setQuery={setQuery}
              kind={kind}
              setKind={setKind}
            />
          }
          refreshing={refreshing}
          renderItem={({ item, index }) => (
            <SearchGroupedProductsListItem
              products={item}
              recyclingKey={item[0].objectID}
              // breaks recycling but it's okay with this list
              key={item[0].objectID}
            />
          )}
          estimatedItemSize={78}
        />
      ) : null}
    </View>
  );
};

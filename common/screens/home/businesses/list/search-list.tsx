import { filtersFromParams } from '@/api/externals/algolia/filtersFromParams';
import { groupProducts } from '@/api/externals/algolia/groupProducts';
import { SearchFilter, SearchKind, SearchOrder } from '@/api/externals/algolia/types';
import { useAlgoliaSearch } from '@/api/externals/algolia/useAlgoliaSearch';
import { useContextCurrentLocation } from '@/api/preferences/context/PreferencesContext';
import { useContextIsUserAnonymous } from '@/common/auth/AuthContext';
import { Loading } from '@/common/components/views/Loading';
import { useInitialState } from '@/common/react/useInitialState';
import paddings from '@/common/styles/paddings';
import { BusinessAlgolia, ProductAlgolia } from '@appjusto/types';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ViewProps } from 'react-native';
import { SearchFiltersModal } from '../../search/search-filters-modal';
import { SearchOrderModal } from '../../search/search-order-modal';
import { SearchBusinessListItem } from './business-list-item/search-business-list-item';
import { SearchGroupedProductsListItem } from './business-list-item/search-grouped-products-list-item';
import { EmptyList } from './empty-list';
import { SearchListHeader, SearchListMode } from './search-list-header';

interface Props extends ViewProps {
  mode: SearchListMode;
}

export const SearchList = ({ style, mode, children, ...props }: Props) => {
  // context
  const isAnonymous = useContextIsUserAnonymous();
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
  const { results, refetch, fetchNextPage } = useAlgoliaSearch<BusinessAlgolia | ProductAlgolia>(
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
    router.navigate('/(logged)/(tabs)/(home)/busca');
  };
  // logs
  // console.log(query);
  // console.log(mode, filters, enabled);
  // console.log('SearchList', filters);
  // console.log('results.length', results?.length);
  // UI
  return (
    <View style={[{ flex: 1 }]}>
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
        kind={kind}
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
            Image.clearDiskCache()
              .then(refetch)
              .finally(() => {
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
          estimatedItemSize={60}
          onEndReached={() => {
            // console.log('onEndReach');
            if (!isAnonymous) fetchNextPage();
          }}
          ListEmptyComponent={
            results ? (
              <EmptyList />
            ) : enabled ? (
              <View style={{ marginTop: paddings.lg }}>
                <Loading />
              </View>
            ) : null
          }
        />
      ) : null}
      {kind === 'product' ? (
        <FlashList
          {...props}
          keyExtractor={(item) => item[0].business.id}
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
              recyclingKey={item[0].business.id}
              // breaks recycling but it's okay with this list
              key={item[0].business.id}
            />
          )}
          estimatedItemSize={150}
          onEndReached={() => {
            console.log('onEndReached');
            if (!isAnonymous) fetchNextPage();
          }}
          ListEmptyComponent={
            results ? (
              <EmptyList />
            ) : enabled ? (
              <View style={{ marginTop: paddings.lg }}>
                <Loading />
              </View>
            ) : null
          }
        />
      ) : null}
    </View>
  );
};

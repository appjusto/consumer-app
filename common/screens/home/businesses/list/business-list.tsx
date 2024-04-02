import { SearchFilter, SearchKind, SearchOrder } from '@/api/externals/algolia/types';
import { useAlgoliaSearch } from '@/api/externals/algolia/useAlgoliaSearch';
import { useContextCurrentLocation } from '@/api/preferences/context/PreferencesContext';
import { BusinessAlgolia } from '@appjusto/types';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, View, ViewProps } from 'react-native';
import { SearchFiltersModal } from '../../search/search-filters-modal';
import { SearchOrderModal } from '../../search/search-order-modal';
import { BusinessListHeader, SearchListMode } from './business-list-header';
import { BusinessListItem } from './business-list-item';

interface Props extends ViewProps {
  mode: SearchListMode;
}

export const BusinessList = ({ style, mode, children, ...props }: Props) => {
  // context
  const location = useContextCurrentLocation();
  // state
  const [kind, setKind] = useState<SearchKind>('restaurant');
  const [order, setOrder] = useState<SearchOrder>('distance');
  const [filters, setFilters] = useState<SearchFilter[]>([]);
  const [filtersModalShown, setFiltersModalShown] = useState(false);
  const [orderModalShown, setOrderModalShown] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState('');
  const { results, isLoading, refetch } = useAlgoliaSearch<BusinessAlgolia>(
    query.length >= (mode === 'home' ? 0 : 4) || filters.length > 0,
    kind,
    order,
    filters,
    location,
    query
  );
  // side effects
  useEffect(() => {
    setOrder('distance');
    setFilters([]);
  }, [kind]);
  // handlers
  const searchHandler = () => {
    router.navigate('/(logged)/(tabs)/(home)/search');
  };
  // logs
  // console.log(query);
  // console.log(filters);
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
          <BusinessListHeader
            openSearch={searchHandler}
            showFiltersModal={() => setFiltersModalShown(true)}
            showOrderModal={() => setOrderModalShown(true)}
            mode={mode}
            query={query}
            setQuery={setQuery}
          />
        }
        refreshing={refreshing}
        renderItem={({ item, index }) => {
          return (
            <Pressable
              onPress={() =>
                router.navigate({
                  pathname: '/(logged)/(tabs)/(home)/r/[businessId]/',
                  params: { businessId: item.objectID },
                })
              }
            >
              {({ pressed }) => (
                <View style={{}}>
                  <BusinessListItem
                    business={item}
                    recyclingKey={item.objectID}
                    // breaks recycling but it's okay with this list
                    key={item.objectID}
                  />
                </View>
              )}
            </Pressable>
          );
        }}
        estimatedItemSize={78}
      />
    </View>
  );
};

import { SearchFilter, SearchOrder } from '@/api/externals/algolia/types';
import { useAlgoliaSearch } from '@/api/externals/algolia/useAlgoliaSearch';
import { useContextCurrentPlace } from '@/api/preferences/context/PreferencesContext';
import { RoundedToggleButton } from '@/common/components/buttons/toggle/rounded-toggle-button';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { useUniqState } from '@/common/react/useUniqState';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { BusinessAlgolia, LatLng } from '@appjusto/types';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { ChevronDown } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, View, ViewProps } from 'react-native';
import { BannerList } from '../../banners/banner-list';
import { CuisineList } from '../../cuisine/cuisine-list';
import { HomeOngoingOrders } from '../../ongoing-orders/home-ongoing-orders';
import { FiltersButton } from '../../search/filters-button';
import { SearchFiltersModal } from '../../search/search-filters-modal';
import { SearchOrderModal } from '../../search/search-order-modal';
import { BusinessListItem } from './business-list-item';

interface Props extends ViewProps {}

const DEFAULT_LOCATION: LatLng = { latitude: -23.541516, longitude: -46.655214 };

export const BusinessList = ({ style, children, ...props }: Props) => {
  // context
  const currentPlace = useContextCurrentPlace();
  // state
  const [order, setOrder] = useState<SearchOrder>('distance');
  const [filters, setFilters] = useState<SearchFilter[]>([]);
  const [filtersModalShown, setFiltersModalShown] = useState(false);
  const [orderModalShown, setOrderModalShown] = useState(false);
  const location = useUniqState<LatLng>(currentPlace?.location ?? DEFAULT_LOCATION);
  const { results, isLoading, refetch } = useAlgoliaSearch<BusinessAlgolia>(
    true,
    'restaurant',
    order,
    filters,
    location
  );
  // side effects
  useEffect(() => {}, []);
  // console.log(results);
  console.log(filters);
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
          refetch()?.then(() => null);
        }}
        ListHeaderComponent={
          <View>
            <CuisineList style={{ marginVertical: paddings.xl, marginLeft: paddings.lg }} />
            <BannerList style={{ marginBottom: paddings.lg, marginLeft: paddings.lg }} />
            <HomeOngoingOrders />
            <DefaultText style={{ marginLeft: paddings.lg }} size="lg">
              Restaurantes
            </DefaultText>
            <View
              style={{ marginLeft: paddings.lg, marginVertical: paddings.sm, flexDirection: 'row' }}
            >
              <FiltersButton
                style={{ marginRight: paddings.sm }}
                onPress={() => setFiltersModalShown(true)}
              />
              <RoundedToggleButton
                title="Ordenação"
                toggled={false}
                onPress={() => setOrderModalShown(true)}
                rightView={
                  <ChevronDown
                    style={{ marginLeft: paddings.sm }}
                    size={16}
                    color={colors.neutral900}
                  />
                }
                {...props}
              />
            </View>
          </View>
        }
        refreshing={isLoading}
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

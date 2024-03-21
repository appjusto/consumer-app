import { useAlgoliaSearch } from '@/api/externals/algolia/useAlgoliaSearch';
import { useContextCurrentPlace } from '@/api/preferences/context/PreferencesContext';
import { useUniqState } from '@/common/react/useUniqState';
import paddings from '@/common/styles/paddings';
import { BusinessAlgolia, LatLng } from '@appjusto/types';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, View, ViewProps } from 'react-native';
import { BannerList } from '../../banners/banner-list';
import { CuisineList } from '../../cuisine/cuisine-list';
import { HomeOngoingOrders } from '../../ongoing-orders/home-ongoing-orders';
import { BusinessListItem } from './business-list-item';

interface Props extends ViewProps {}

const DEFAULT_LOCATION: LatLng = { latitude: -23.541516, longitude: -46.655214 };

export const BusinessList = ({ style, children, ...props }: Props) => {
  // context
  const currentPlace = useContextCurrentPlace();
  // state
  const filters = useUniqState([]);
  const location = useUniqState<LatLng>(currentPlace?.location ?? DEFAULT_LOCATION);
  const { results, isLoading, refetch } = useAlgoliaSearch<BusinessAlgolia>(
    true,
    'restaurant',
    'distance',
    filters,
    location
  );
  // side effects
  useEffect(() => {}, []);
  // console.log(results);
  // UI
  return (
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
  );
};

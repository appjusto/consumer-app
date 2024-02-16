import { useAlgoliaSearch } from '@/api/externals/algolia/useAlgoliaSearch';
import { useContextCurrentPlace } from '@/api/preferences/context/PreferencesContext';
import { useUniqState } from '@/common/react/useUniqState';
import { BusinessAlgolia, LatLng } from '@appjusto/types';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, View, ViewProps } from 'react-native';
import { BusinessListItem } from './business-list-item';

interface Props extends ViewProps {}

const DEFAULT_LOCATION: LatLng = { latitude: -23.541516, longitude: -46.655214 };

export const BusinessList = ({ style, ...props }: Props) => {
  // context
  const currentPlace = useContextCurrentPlace();
  // state
  const filters = useUniqState([]);
  const location = useUniqState<LatLng>(currentPlace?.location ?? DEFAULT_LOCATION);
  const { results, isLoading } = useAlgoliaSearch<BusinessAlgolia>(
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
  if (isLoading) return null;
  return (
    <FlashList
      {...props}
      keyExtractor={(item) => item.objectID}
      data={results}
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
                  item={item}
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

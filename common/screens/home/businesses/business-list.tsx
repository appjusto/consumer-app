import { useAlgoliaSearch } from '@/api/externals/algolia/useAlgoliaSearch';
import { useUniqState } from '@/common/react/useUniqState';
import { BusinessAlgolia, LatLng } from '@appjusto/types';
import { FlashList, FlashListProps } from '@shopify/flash-list';
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { BusinessListItem } from './business-list-item';

interface Props<P> extends FlashListProps<P> {}

export const BusinessList = ({ style, ...props }: Props<object>) => {
  // state
  const filters = useUniqState([]);
  const location = useUniqState<LatLng>({ latitude: -23.541516, longitude: -46.655214 });
  const { results } = useAlgoliaSearch<BusinessAlgolia>(
    true,
    'restaurant',
    'distance',
    filters,
    location
  );
  // console.log(results);
  // UI
  return (
    <FlashList
      keyExtractor={(item) => item.objectID}
      data={results}
      renderItem={({ item, index }) => {
        return (
          <Pressable
            onPress={() =>
              router.push({
                pathname: '/(logged)/r/[id]',
                params: { id: item.objectID },
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

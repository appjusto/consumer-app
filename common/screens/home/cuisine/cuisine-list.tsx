import { useCuisines } from '@/api/platform/cuisines/useCuisines';
import paddings from '@/common/styles/paddings';
import { Cuisine, WithId } from '@appjusto/types';
import { FlashList } from '@shopify/flash-list';
import { Pressable, View, ViewProps } from 'react-native';
import { CuisineListItem } from './cuisine-list-item';

interface Props extends ViewProps {}

const SIZE = 96;
const keyExtractor = (item: WithId<Cuisine> | null, index: number) => item?.id ?? `${index}`;

export const CuisineList = ({ style, ...props }: Props) => {
  // state
  const cuisines = useCuisines() ?? [null, null, null, null];
  // UI
  return (
    <View style={[{}, style]} {...props}>
      <FlashList
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={keyExtractor}
        data={cuisines}
        renderItem={({ item, index }) => {
          return (
            <Pressable onPress={() => {}}>
              {() => (
                <View style={{ marginLeft: index > 0 ? paddings.lg : 0 }}>
                  <CuisineListItem
                    // breaks recycling but it's okay with this list
                    key={keyExtractor(item, index)}
                    item={item}
                    recyclingKey={keyExtractor(item, index)}
                  />
                </View>
              )}
            </Pressable>
          );
        }}
        estimatedItemSize={SIZE}
      />
    </View>
  );
};

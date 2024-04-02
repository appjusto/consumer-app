import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { useEffect, useRef } from 'react';
import { Pressable, ScrollView, ScrollViewProps, View } from 'react-native';
import { DefaultText } from '../../texts/DefaultText';

export interface HorizontalSelectorItem {
  title: string | null;
  subtitle?: string;
  data?: any;
}

interface Props extends ScrollViewProps {
  data: HorizontalSelectorItem[];
  selectedIndex: number;
  size?: 'default' | 'sm';
  onSelect: (index: number) => void;
}

export const HorizontalSelector = ({
  data,
  selectedIndex,
  size = 'default',
  onSelect,
  style,
  ...props
}: Props) => {
  // refs
  const scroll = useRef<ScrollView>(null);
  const positions = useRef<Map<number, number>>(new Map());
  // state
  // side effects
  useEffect(() => {
    const x = positions.current?.get(selectedIndex) ?? 0;
    scroll.current?.scrollTo({ x });
  }, [selectedIndex]);
  // UI
  return (
    <View style={[{}, style]}>
      <ScrollView ref={scroll} {...props} horizontal showsHorizontalScrollIndicator={false}>
        {data.map((value, index) => (
          <Pressable
            style={{ borderWidth: 0 }}
            onPress={() => onSelect(index)}
            key={value.title}
            onLayout={(ev) => {
              positions.current?.set(index, ev.nativeEvent.layout.x);
            }}
          >
            <View style={{ borderWidth: 0, marginLeft: index > 0 ? paddings.xs : 0 }}>
              <View style={{ padding: paddings.sm, borderWidth: 0 }}>
                <DefaultText
                  style={{ textAlign: 'center' }}
                  size={size === 'default' ? 'md' : 'sm'}
                >
                  {value.title}
                </DefaultText>
                {value.subtitle ? (
                  <DefaultText style={{ textAlign: 'center' }} color="neutral700">
                    {value.subtitle}
                  </DefaultText>
                ) : null}
              </View>
              {index === selectedIndex ? (
                <View style={{ height: 2, backgroundColor: colors.black }} />
              ) : null}
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
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
  onSelect: (index: number) => void;
}

export const HorizontalSelector = ({ data, selectedIndex, onSelect, style, ...props }: Props) => {
  return (
    <ScrollView style={[{}, style]} {...props} horizontal showsHorizontalScrollIndicator={false}>
      {data.map((value, index) => (
        <Pressable onPress={() => onSelect(index)} key={value.title}>
          <View style={{ borderWidth: 0, marginLeft: index > 0 ? paddings.xs : 0 }}>
            <View style={{ flex: 1, padding: paddings.sm }}>
              <DefaultText style={{ textAlign: 'center' }} size="md">
                {value.title}
              </DefaultText>
              {value.subtitle ? (
                <DefaultText style={{ textAlign: 'center' }} color="neutral700">
                  {value.subtitle}
                </DefaultText>
              ) : null}
            </View>
            {index === selectedIndex ? (
              <View style={{ flex: 1, height: 2, backgroundColor: colors.black }} />
            ) : null}
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
};

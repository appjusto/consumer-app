import { DefaultText } from '@/common/components/texts/DefaultText';
import borders from '@/common/styles/borders';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { Order, WithId } from '@appjusto/types';
import { ChevronRight } from 'lucide-react-native';
import { Pressable, View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  order: WithId<Order>;
}

export const OngoingOrderEstimateFoodOverview = ({ order, style, ...props }: Props) => {
  const { business, code } = order;
  if (!business?.id) return null;
  // UI
  return (
    <View
      style={[
        {
          paddingHorizontal: paddings.lg,
          paddingVertical: paddings.lgg,
          backgroundColor: colors.white,
          ...borders.white,
        },
        style,
      ]}
      {...props}
    >
      {/* header */}
      <Pressable>
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <View>
            <DefaultText color="neutral700">Detalhes do pedido</DefaultText>
            <DefaultText
              style={{ marginTop: paddings.sm }}
              size="md"
              color="black"
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {business.name}
            </DefaultText>
            <DefaultText color="neutral800">{`Pedido #${code}`}</DefaultText>
          </View>
          <ChevronRight color={colors.neutral800} size={20} />
        </View>
      </Pressable>
      {/* payment */}
      <View></View>
    </View>
  );
};

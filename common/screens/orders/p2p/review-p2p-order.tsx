import { DefaultText } from '@/common/components/texts/DefaultText';
import { HR } from '@/common/components/views/HR';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { Order, WithId } from '@appjusto/types';
import { Pressable, View, ViewProps } from 'react-native';
import { getPlaceTitle } from '../places/label';
import { PlaceKey } from '../places/types';
import { ReviewP2POrderPlace } from './review-p2p-order-place';

interface Props extends ViewProps {
  quote: WithId<Order> | null | undefined;
  onEditPlace: (key: PlaceKey | number) => void;
}

export const ReviewP2POrder = ({ style, quote, onEditPlace, ...props }: Props) => {
  if (!quote) return null;
  const { origin, destination } = quote;
  return (
    <View style={[{}, style]} {...props}>
      <DefaultText size="lg">Confirme os endereços da rota</DefaultText>
      <View
        style={{
          marginTop: paddings.lg,
          paddingHorizontal: paddings.lg,
          paddingVertical: paddings.lgg,
          borderWidth: 1,
          borderColor: colors.neutral100,
          borderRadius: 8,
        }}
      >
        <Pressable onPress={() => onEditPlace('origin')}>
          <ReviewP2POrderPlace place={origin} title={getPlaceTitle('origin')} />
        </Pressable>
        <HR style={{ marginTop: paddings.lg }} />
        <Pressable onPress={() => onEditPlace('destination')}>
          <ReviewP2POrderPlace
            style={{ marginTop: paddings.lg }}
            place={destination}
            title={getPlaceTitle('destination')}
          />
        </Pressable>
      </View>
    </View>
  );
};

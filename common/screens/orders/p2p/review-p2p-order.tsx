import { DefaultText } from '@/common/components/texts/DefaultText';
import { HR } from '@/common/components/views/HR';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { Order, WithId } from '@appjusto/types';
import { View, ViewProps } from 'react-native';
import { getPlaceTitle } from '../places/label';
import { PlaceKey } from '../places/types';
import { ReviewP2POrderPlace } from './review-p2p-order-place';

interface Props extends ViewProps {
  quote: WithId<Order> | null | undefined;
  originInstructions?: string;
  setOriginInstructions?: (value: string) => void;
  destinationInstructions?: string;
  setDestinationInstructions?: (value: string) => void;
  onEditPlace?: (key: PlaceKey | number) => void;
}

export const ReviewP2POrder = ({
  style,
  quote,
  originInstructions,
  setOriginInstructions,
  destinationInstructions,
  setDestinationInstructions,
  onEditPlace,
  ...props
}: Props) => {
  const { origin, destination } = quote ?? {};

  // UI
  if (!quote) return null;
  return (
    <View style={[{}, style]} {...props}>
      <DefaultText size="lg">Endereços da rota</DefaultText>
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
        <ReviewP2POrderPlace
          place={origin}
          title={getPlaceTitle('origin')}
          onEdit={onEditPlace ? () => onEditPlace('origin') : undefined}
          instructions={originInstructions}
          setInstructions={setOriginInstructions}
        />
        <HR style={{ marginTop: paddings.lg }} />
        <ReviewP2POrderPlace
          style={{ marginTop: paddings.lg }}
          place={destination}
          title={getPlaceTitle('destination')}
          onEdit={onEditPlace ? () => onEditPlace('destination') : undefined}
          instructions={destinationInstructions}
          setInstructions={setDestinationInstructions}
        />
      </View>
    </View>
  );
};

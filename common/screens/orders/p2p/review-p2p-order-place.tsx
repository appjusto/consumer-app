import { DefaultText } from '@/common/components/texts/DefaultText';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { Place } from '@appjusto/types';
import { FilePenLine } from 'lucide-react-native';
import { View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  place: Place | null | undefined;
  title: string;
}

export const ReviewP2POrderPlace = ({ style, place, title, ...props }: Props) => {
  if (!place) return;
  return (
    <View
      style={[
        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
        style,
      ]}
      {...props}
    >
      <View>
        <DefaultText color="neutral800">{title}</DefaultText>
        <DefaultText style={{ marginTop: paddings.xs }} size="md">
          {place.address.main}
        </DefaultText>
        <DefaultText style={{ marginTop: paddings.xs }} size="sm" color="neutral700">{`${place
          .address?.secondary}${
          place?.additionalInfo ? ` \u00B7 ${place.additionalInfo}` : ''
        }`}</DefaultText>
        {place.instructions ? (
          <DefaultText style={{ marginTop: paddings.xs }} size="sm" color="neutral700">
            {place.instructions}
          </DefaultText>
        ) : null}
      </View>
      <View>
        <FilePenLine size={24} color={colors.black} />
      </View>
    </View>
  );
};

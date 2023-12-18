import { OnlyIconButton } from '@/common/components/buttons/icon/OnlyIconButton';
import { DefaultText } from '@/common/components/texts/DefaultText';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { Place } from '@appjusto/types';
import { MapPin, MoreVertical } from 'lucide-react-native';
import { Pressable, View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  place: Place;
  checked?: boolean;
  onPress: () => void;
  onSelectOptions: () => void;
}

export const PlaceListItem = ({
  place,
  checked,
  style,
  children,
  onSelectOptions,
  ...props
}: Props) => {
  return (
    <Pressable
      style={[
        {
          padding: paddings.lg,
          backgroundColor: checked ? colors.primary100 : colors.white,
          borderColor: checked ? colors.primary500 : colors.neutral100,
          borderWidth: 1,
          borderRadius: 8,
        },
        style,
      ]}
      {...props}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <MapPin size={20} color={checked ? colors.primary900 : colors.neutral900} />
        <View style={{ flex: 1, marginLeft: paddings.lg }}>
          <DefaultText size="md" color="black">
            {place.address.main}
          </DefaultText>
          <DefaultText style={{ marginTop: paddings.xs }} color="neutral800">
            {place.address.secondary}
          </DefaultText>
          {place.additionalInfo ? (
            <DefaultText style={{ marginTop: paddings.xs }} size="xs" color="neutral800">
              {place.additionalInfo}
            </DefaultText>
          ) : null}
        </View>
        <OnlyIconButton
          icon={<MoreVertical size={20} color={checked ? colors.primary900 : colors.neutral900} />}
          onPress={onSelectOptions}
        />
      </View>
    </Pressable>
  );
};

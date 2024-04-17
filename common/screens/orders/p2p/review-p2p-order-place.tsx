import { DefaultInput } from '@/common/components/inputs/default/DefaultInput';
import { DefaultText } from '@/common/components/texts/DefaultText';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { Place } from '@appjusto/types';
import { FilePenLine } from 'lucide-react-native';
import { Pressable, View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  place: Place | null | undefined;
  title: string;
  instructions?: string;
  setInstructions?: (value: string) => void;
  onEdit?: () => void;
}

export const ReviewP2POrderPlace = ({
  style,
  place,
  title,
  instructions,
  setInstructions,
  onEdit,
  ...props
}: Props) => {
  if (!place) return;
  return (
    <View style={[{}, style]} {...props}>
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
          {!instructions && place.instructions ? (
            <DefaultText style={{ marginTop: paddings.xs }} size="sm" color="neutral700">
              {place.instructions}
            </DefaultText>
          ) : null}
        </View>
        {onEdit ? (
          <Pressable onPress={onEdit}>
            <View>
              <FilePenLine size={24} color={colors.black} />
            </View>
          </Pressable>
        ) : null}
      </View>
      {setInstructions ? (
        <View>
          <DefaultInput
            style={{ marginTop: paddings.md }}
            inputStyle={{ minHeight: 40 }}
            title={`Instruções para ${title.toLowerCase()}`}
            placeholder="Quem irá atender o/a entregador/a, etc."
            value={instructions}
            onChangeText={setInstructions}
            multiline
            textAlignVertical="top"
            blurOnSubmit
            returnKeyType="done"
          />
        </View>
      ) : null}
    </View>
  );
};

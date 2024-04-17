import { aboutCourier } from '@/api/orders/courier/about';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { FullDate, formatTimestamp } from '@/common/formatters/timestamp';
import Selfie from '@/common/screens/profile/images/selfie';
import borders from '@/common/styles/borders';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { PublicCourier, WithId } from '@appjusto/types';
import { ThumbsDown, ThumbsUp } from 'lucide-react-native';
import { View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  courier: WithId<PublicCourier> | null | undefined;
  title?: string;
}

export const CourierCard = ({ courier, title, style, children, ...props }: Props) => {
  if (!courier) return null;
  return (
    <View
      style={[
        {
          padding: paddings.lg,
          ...borders.default,
          borderColor: colors.neutral100,
        },
        style,
      ]}
      {...props}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View>
          {title ? (
            <DefaultText style={{ marginBottom: paddings.sm }} color="neutral700">
              {title}
            </DefaultText>
          ) : null}
          <DefaultText size="md" color="black">
            {courier.name}
          </DefaultText>
          <DefaultText style={{ maxWidth: '70%' }} size="xs" color="neutral800">
            {aboutCourier(courier)}
          </DefaultText>
        </View>
        <Selfie courierId={courier.id} size={50} />
      </View>

      <View
        style={{
          marginTop: paddings.lg,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <View>
          <DefaultText size="xs">Nº de corridas</DefaultText>
          <DefaultText style={{ marginTop: paddings.xs }} size="md" color="black">
            {courier.statistics.deliveries}
          </DefaultText>
        </View>
        <View>
          <DefaultText size="xs">Avaliações</DefaultText>
          <View style={{ marginTop: paddings.xs, flexDirection: 'row', alignItems: 'center' }}>
            <ThumbsUp size={16} color={colors.primary500} />
            <DefaultText style={{ marginLeft: paddings.xs }} size="md" color="primary900">
              {courier.statistics.positiveReviews}
            </DefaultText>
            <ThumbsDown style={{ marginLeft: paddings.sm }} size={16} color={colors.neutral500} />
            <DefaultText style={{ marginLeft: paddings.xs }} size="md" color="neutral700">
              {courier.statistics.negativeReviews}
            </DefaultText>
          </View>
        </View>
        {courier.createdAt ? (
          <View>
            <DefaultText size="xs">Membro desde</DefaultText>
            <DefaultText style={{ marginTop: paddings.xs }} size="md" color="black">
              {formatTimestamp(courier.createdAt, FullDate)}
            </DefaultText>
          </View>
        ) : null}
      </View>
      {children}
    </View>
  );
};

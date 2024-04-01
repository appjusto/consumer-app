import { formatHour } from '@/api/business/schedule/formatHour';
import { useContextGetServerTime } from '@/api/platform/context/platform-context';
import { DefaultText } from '@/common/components/texts/DefaultText';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { PublicBusiness, WithId } from '@appjusto/types';
import { Text, View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  business: WithId<PublicBusiness> | undefined | null;
}

export const BusinessAboutSchedule = ({ business, style, ...props }: Props) => {
  // context
  const getServerTime = useContextGetServerTime();
  const now = getServerTime();
  const day = now.getDay();
  const dayIndex = day === 0 ? 6 : day - 1;
  if (!business) return null;
  const { schedules } = business;
  return (
    <View style={[{ flexDirection: 'row', marginTop: paddings.xl }, style]} {...props}>
      <View>
        {schedules.map((item, index) => (
          <ScheduleText position="left" selected={dayIndex === index} key={item.day}>
            {item.day}
          </ScheduleText>
        ))}
      </View>
      <View>
        {schedules.map((item, index) => (
          <ScheduleText key={item.day} position="right" selected={index === dayIndex}>
            {item.checked
              ? item.schedule
                  .map(({ from, to }) => `${formatHour(from)} às ${formatHour(to)}`)
                  .join('  -  ')
              : 'Fechado'}
          </ScheduleText>
        ))}
      </View>
    </View>
  );
};

export type ScheduleTextProps = Text['props'] & {
  position: 'left' | 'right';
  selected: boolean;
};

const ScheduleText = ({ position, selected, children, style, ...props }: ScheduleTextProps) => {
  return (
    <View
      style={[
        {
          borderTopLeftRadius: position === 'left' ? 8 : 0,
          borderBottomLeftRadius: position === 'left' ? 8 : 0,
          borderTopRightRadius: position === 'right' ? 8 : 0,
          borderBottomRightRadius: position === 'right' ? 8 : 0,
          backgroundColor: selected ? colors.primary100 : undefined,
          padding: paddings.sm,
          marginBottom: paddings.xl,
          paddingLeft: position === 'right' ? paddings['2xl'] : paddings.sm,
        },
        style,
      ]}
    >
      <DefaultText size="md" {...props}>
        {children}
      </DefaultText>
    </View>
  );
};

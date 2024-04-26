import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import { DefaultModal } from '@/common/components/modals/default-modal';
import { DefaultText } from '@/common/components/texts/DefaultText';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { ModalProps, Pressable, View } from 'react-native';
import { Period } from './period-control';

interface PeriodItemProps {
  text: string;
}

const PeriodItem = ({ text }: PeriodItemProps) => (
  <DefaultText
    style={{ marginVertical: paddings.xl, textAlign: 'center' }}
    size="md"
    color="neutral800"
  >
    {text}
  </DefaultText>
);

interface Props extends ModalProps {
  onSelectPeriod: (period: Period) => void;
  onSelectDate: (date: Date) => void;
  onCancel: () => void;
}
export const PeriodModal = ({ onSelectPeriod, onCancel, onSelectDate, ...props }: Props) => {
  // state
  const [mode, setMode] = useState<'custom' | 'period'>('period');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  // handlers
  const changeHandler = (event: DateTimePickerEvent, date?: Date) => {
    const {
      type,
      nativeEvent: { timestamp },
    } = event;
    if (type === 'set' && timestamp) {
      const date = new Date(timestamp);
      setSelectedDate(date);
      onSelectDate(date);
    }
  };
  // UI
  return (
    <DefaultModal onDismiss={onCancel} {...props}>
      <View style={{ padding: paddings.lg, backgroundColor: colors.white }}>
        {mode === 'period' ? (
          <View>
            <DefaultText style={{ marginVertical: paddings['2xl'], textAlign: 'center' }} size="lg">
              Visualizar por
            </DefaultText>
            <Pressable onPress={() => onSelectPeriod('day')}>
              {({ pressed }) => <PeriodItem text="Dia" />}
            </Pressable>
            <Pressable onPress={() => onSelectPeriod('week')}>
              {({ pressed }) => <PeriodItem text="Semana" />}
            </Pressable>
            <Pressable onPress={() => onSelectPeriod('month')}>
              {({ pressed }) => <PeriodItem text="Mês" />}
            </Pressable>
          </View>
        ) : (
          <View style={{ margin: paddings.xl }}>
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="inline"
              maximumDate={new Date()}
              onChange={changeHandler}
            />
          </View>
        )}
        <DefaultButton
          title={mode === 'custom' ? 'Escolher período' : 'Escolher data inicial'}
          onPress={() => setMode((value) => (value === 'custom' ? 'period' : 'custom'))}
        />
      </View>
    </DefaultModal>
  );
};

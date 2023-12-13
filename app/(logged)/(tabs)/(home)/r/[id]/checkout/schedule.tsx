import { useContextApi } from '@/api/ApiContext';
import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextBusiness } from '@/api/business/context/business-context';
import { getNextDateSlots } from '@/api/business/schedule/getNextDateSlots';
import { fromDate } from '@/api/firebase/timestamp';
import { useContextOrderQuote } from '@/api/orders/context/order-context';
import { useContextGetServerTime } from '@/api/platform/context/platform-context';
import { RadioCardButton } from '@/common/components/buttons/radio/RadioCardButton';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import {
  HorizontalSelector,
  HorizontalSelectorItem,
} from '@/common/components/containers/horizontal-selector/horizontal-selector';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { Loading } from '@/common/components/views/Loading';
import { timestampWithETA } from '@/common/formatters/timestamp';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { Dayjs } from '@appjusto/dates';
import { Stack, router } from 'expo-router';
import { capitalize } from 'lodash';
import { Clock3 } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

export default function OrderCheckoutScheduleScreen() {
  // context
  const api = useContextApi();
  const business = useContextBusiness();
  const quote = useContextOrderQuote();
  const getServerTime = useContextGetServerTime();
  // state
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [nextDateSlots, setNextDateSlots] = useState<Date[][]>();
  const [days, setDays] = useState<Date[]>();
  const [daySelectorData, setDaySelectorData] = useState<HorizontalSelectorItem[]>();
  // tracking
  useTrackScreenView('Checkout: agendamento');
  // side effects
  useEffect(() => {
    if (!business) return;
    if (!nextDateSlots) setNextDateSlots(getNextDateSlots(business, getServerTime(), 60, 4));
  }, [business, getServerTime, nextDateSlots]);
  useEffect(() => {
    if (!nextDateSlots) return;
    setDays(nextDateSlots.filter((value) => Boolean(value.length)).map((slot) => slot[0]));
  }, [nextDateSlots]);
  useEffect(() => {
    if (!days) return;
    const now = getServerTime();
    setDaySelectorData(
      days.map((date) => ({
        title: `${date?.getDate()}`,
        subtitle: capitalize(
          Dayjs(date)
            .calendar(now, {
              sameDay: '[Hoje]',
              nextDay: 'dddd',
              nextWeek: 'dddd',
              sameElse: 'dddd',
            })
            .replace('-feira', '')
        ),
        data: date,
      }))
    );
  }, [days, getServerTime]);
  useEffect(() => {
    if (!daySelectorData) return;
    const item = daySelectorData[selectedIndex];
    if (item && !Dayjs(item.data).isSame(selectedDate)) {
      setSelectedDate(item.data);
    }
  }, [selectedIndex, selectedDate, daySelectorData]);
  // handlers
  const scheduleOrder = (date: Date) => {
    if (!quote) return;
    api
      .orders()
      .updateOrder(quote.id, { scheduledTo: fromDate(date) })
      .then(() => {
        router.back();
      });
  };
  // UI
  if (!quote || !daySelectorData) return <Loading />;
  const scheduledTo = quote.scheduledTo ? quote.scheduledTo.toDate() : null;
  return (
    <DefaultScrollView style={{ ...screens.default }}>
      <Stack.Screen options={{ title: 'Agendamento' }} />
      <DefaultView style={{ padding: paddings.lg }}>
        <HorizontalSelector
          data={daySelectorData}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
        />
        <View style={{ marginTop: paddings.xl }}>
          {nextDateSlots && Array.isArray(nextDateSlots[selectedIndex])
            ? nextDateSlots[selectedIndex].map((date) => (
                <View style={{ marginTop: paddings.lg }} key={date.toISOString()}>
                  <RadioCardButton
                    checked={Dayjs(date).isSame(scheduledTo)}
                    onPress={() => scheduleOrder(date)}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Clock3 size={20} color={colors.primary900} />
                      <DefaultText style={{ marginLeft: paddings.lg }} size="md" color="black">
                        {timestampWithETA(fromDate(date))}
                      </DefaultText>
                    </View>
                  </RadioCardButton>
                </View>
              ))
            : null}
        </View>
      </DefaultView>
    </DefaultScrollView>
  );
}

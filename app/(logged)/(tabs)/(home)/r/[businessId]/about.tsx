import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextBusiness } from '@/api/business/context/business-context';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { HorizontalSelector } from '@/common/components/containers/horizontal-selector/horizontal-selector';
import { ModalHandle } from '@/common/components/modals/modal-handle';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { BussinessAboutMore } from '@/common/screens/home/businesses/detail/about/business-about-more';
import { BusinessAboutPayment } from '@/common/screens/home/businesses/detail/about/business-about-payments';
import { BusinessAboutSchedule } from '@/common/screens/home/businesses/detail/about/business-about-schedule';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

export default function BusinessAboutScreen() {
  // params
  const params = useLocalSearchParams<{ businessId: string }>();
  const businessId = params.businessId;
  // context
  const business = useContextBusiness();
  // state
  const [selectedIndex, setSelectedIndex] = useState(0);
  // tracking
  useTrackScreenView('Sobre Restaurante', { businessId });
  // UI
  return (
    <View style={{ ...screens.default, padding: paddings.lg }}>
      <ModalHandle />
      <DefaultText style={{ marginVertical: paddings.xl, alignSelf: 'center' }} size="lg">
        Saber mais
      </DefaultText>
      <HorizontalSelector
        style={{ marginVertical: paddings.lg }}
        data={[
          { title: 'Formas de pagmento' },
          { title: 'Horário de funcionamento' },
          { title: 'Outras informações' },
        ]}
        selectedIndex={selectedIndex}
        onSelect={setSelectedIndex}
      />
      <DefaultScrollView style={{ ...screens.default, marginLeft: paddings.sm }}>
        {selectedIndex === 0 ? <BusinessAboutPayment business={business} /> : null}
        {selectedIndex === 1 ? <BusinessAboutSchedule business={business} /> : null}
        {selectedIndex === 2 ? <BussinessAboutMore business={business} /> : null}
      </DefaultScrollView>
    </View>
  );
}

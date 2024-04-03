import { useDistance } from '@/api/maps/distance/useDistance';
import { useContextCurrentPlace } from '@/api/preferences/context/PreferencesContext';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { BusinessAlgolia, PublicBusiness } from '@appjusto/types';
import { View, ViewProps } from 'react-native';
import { BusinessListItemReview } from './business-list-item-reviews';

interface Props extends ViewProps {
  business: BusinessAlgolia | PublicBusiness;
}

export const BusinessItemInfo = ({ business, style, ...props }: Props) => {
  // state
  const location = useContextCurrentPlace()?.location;
  const distance = useDistance(location, business?.businessAddress?.latlng);
  const distanceInKm = (() => {
    if (typeof distance !== 'number') return '';
    return `${distance === 0 ? 0 : (distance / 1000).toFixed(1)}km  •  `;
  })();
  const cookingTime = business.averageCookingTime ? business.averageCookingTime / 60 : 40;
  const positive = business.reviews?.positiveReviews ?? 0;
  const negative = business.reviews?.negativeReviews ?? 0;
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]} {...props}>
      <BusinessListItemReview positive={positive} negative={negative} />
      <DefaultText
        style={{ borderWidth: 0 }}
        color="neutral700"
        size="xs"
      >{`  •  ${business.cuisine}  •  ${distanceInKm}${cookingTime}min`}</DefaultText>
    </View>
  );
};

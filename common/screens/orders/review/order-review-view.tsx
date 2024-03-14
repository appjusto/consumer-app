import { useObserveOrderReview } from '@/api/orders/reviews/useObserveOrderReview';
import { DefaultText } from '@/common/components/texts/DefaultText';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { ReviewType } from '@appjusto/types';
import { useEffect } from 'react';
import { View, ViewProps } from 'react-native';
import { NPS } from '../nps/NPS';
import { AspectReview } from './aspect-review';

interface Props extends ViewProps {
  orderId?: string;
  courierReview: ReviewType | undefined;
  businessReview: ReviewType | undefined;
  platformReview: ReviewType | undefined;
  nps?: number;
  disabled?: boolean;
  setCourierReview: (type: ReviewType) => void;
  setBusinessReview?: (type: ReviewType) => void;
  setPlatformReview: (type: ReviewType) => void;
  setNPS: (value: number) => void;
}

export const OrderReviewView = ({
  orderId,
  courierReview,
  businessReview,
  platformReview,
  nps,
  disabled,
  setCourierReview,
  setBusinessReview,
  setPlatformReview,
  setNPS,
  style,
  ...props
}: Props) => {
  // state
  const review = useObserveOrderReview(orderId);
  console.log(review);
  // side effects
  useEffect(() => {
    if (!review) return;
    if (review.consumerReview) setCourierReview(review.consumerReview.rating);
    if (review.business && setBusinessReview) setBusinessReview(review.business.rating);
    if (review.platform) setPlatformReview(review.platform.rating);
    if (review.nps) setNPS(review.nps);
  }, [review, setPlatformReview, setBusinessReview, setCourierReview, setNPS]);
  // UI
  const reallyDisabled = disabled || Boolean(review);
  const showReviewBox = !review || courierReview || businessReview || platformReview;
  return (
    <View>
      {showReviewBox ? (
        <View
          style={[
            {
              backgroundColor: colors.white,
              padding: paddings.lg,
              borderRadius: 8,
              borderColor: colors.neutral100,
              borderWidth: 1,
            },
            style,
          ]}
          {...props}
        >
          <DefaultText size="lg">Avalie sua experiência</DefaultText>
          {!review || courierReview ? (
            <AspectReview
              style={{ marginTop: paddings.lg }}
              label="Entregador/a"
              type={courierReview}
              disabled={reallyDisabled}
              onChange={setCourierReview}
            />
          ) : null}
          {(!review && setBusinessReview) || businessReview ? (
            <AspectReview
              style={{ marginTop: paddings.lg }}
              label="Restaurante"
              type={businessReview}
              disabled={reallyDisabled}
              onChange={setBusinessReview}
            />
          ) : null}
          {!review || platformReview ? (
            <AspectReview
              style={{ marginTop: paddings.lg }}
              label="appjusto"
              type={platformReview}
              disabled={reallyDisabled}
              onChange={setPlatformReview}
            />
          ) : null}
        </View>
      ) : null}
      {!review || nps ? (
        <NPS
          style={{ marginTop: showReviewBox ? paddings.lg : 0 }}
          value={nps}
          disabled={reallyDisabled}
          onChange={setNPS}
        />
      ) : null}
    </View>
  );
};

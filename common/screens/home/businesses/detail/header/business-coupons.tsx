import { useObserveCoupons } from '@/api/business/coupons/useObserveCoupons';
import { SimpleBadge } from '@/common/components/badges/simple-badge';
import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import { DefaultModal } from '@/common/components/modals/default-modal';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { formatCurrency } from '@/common/formatters/currency';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { Coupon, PublicBusiness, WithId } from '@appjusto/types';
import { useState } from 'react';
import { Pressable, View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  business: WithId<PublicBusiness>;
}

const getCouponDescription = (coupon: Coupon) => {
  let description = '';
  if (coupon.type === 'delivery-free') {
    description = 'Entrega grátis.';
  } else {
    description = 'Desconto';
    if (coupon.discount) description += ` de ${formatCurrency(coupon.discount)}`;
    if (coupon.type === 'delivery-discount') {
      description += ' na entrega';
    }
  }
  if (coupon.minOrderValue) {
    description += ` em compras acima de ${formatCurrency(coupon.minOrderValue)}.`;
  } else {
    description += '.';
  }
  if (coupon.usagePolicy === 'new-customers') {
    description += ' Válido apenas na primeira compra na loja.';
  } else if (coupon.usagePolicy === 'once' || coupon.usagePolicy === 'renewable') {
    description += ' Válido apenas uma vez.';
  }
  return description;
};

export const BusinessCoupons = ({ business, style, ...props }: Props) => {
  // state
  const coupons = useObserveCoupons(business.id);
  const [selectedCoupon, setSelectedCoupons] = useState<WithId<Coupon>>();
  // UI
  if (!coupons?.length) return null;
  return (
    <View style={[{}, style]} {...props}>
      <DefaultText>Cupons disponíveis:</DefaultText>
      <DefaultModal visible={!!selectedCoupon} onDismiss={() => setSelectedCoupons(undefined)}>
        {selectedCoupon ? (
          <View
            style={{
              padding: paddings['2xl'],
              backgroundColor: colors.white,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <DefaultText size="xl" color="primary900">
              {selectedCoupon.code}
            </DefaultText>
            <DefaultText size="md" style={{ marginVertical: paddings['2xl'], textAlign: 'center' }}>
              {getCouponDescription(selectedCoupon)}
            </DefaultText>
            <DefaultButton
              style={{ width: '100%' }}
              title="Fechar"
              variant="outline"
              onPress={() => setSelectedCoupons(undefined)}
            />
          </View>
        ) : null}
      </DefaultModal>
      <View style={{ flexDirection: 'row', marginTop: paddings.sm }}>
        {coupons.map((coupon) => (
          <Pressable key={coupon.id} onPress={() => setSelectedCoupons(coupon)}>
            <SimpleBadge style={{ marginRight: paddings.sm }} variant="primary">
              {coupon.code}
            </SimpleBadge>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

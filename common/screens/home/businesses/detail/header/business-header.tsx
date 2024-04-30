import { getBusinessCoverStoragePath } from '@/api/business/business-api';
import { useImageURL } from '@/api/storage/useImageURL';
import { LinkButton } from '@/common/components/buttons/link/LinkButton';
import { HorizontalSelector } from '@/common/components/containers/horizontal-selector/horizontal-selector';
import { DefaultText } from '@/common/components/texts/DefaultText';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { percentOfWidth } from '@/common/version/device';
import { PublicBusiness, WithId } from '@appjusto/types';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Skeleton } from 'moti/skeleton';
import { Dimensions, View, ViewProps } from 'react-native';
import { AppJustoOnlyIcon } from '../../icons/appjusto-only-icon';
import { DiscountIcon } from '../../icons/discount-icon';
import { BusinessBadges } from '../../list/business-list-item/business-badges';
import { BusinessItemInfo } from '../../list/business-list-item/business-info';
import { BusinessLogo } from '../../logo/business-logo';
interface Props extends ViewProps {
  business: WithId<PublicBusiness>;
  hidden: boolean;
  categories: string[] | undefined;
  categoryIndex: number;
  onCategorySelect: (index: number) => void;
}

const WIDTH = Dimensions.get('screen').width;
const HEIGHT = 150;

export const BusinessHeader = ({
  business,
  hidden,
  categories,
  categoryIndex,
  onCategorySelect,
  style,
  ...props
}: Props) => {
  // state
  const appjustoOnly = business.tags?.includes('appjusto-only');
  const discount = business.averageDiscount ?? 0;
  const coverUrl = useImageURL(getBusinessCoverStoragePath(business.id));

  // handlers
  const detailHandler = () => {
    router.navigate({
      pathname: '/(logged)/(tabs)/(home)/r/[businessId]/about',
      params: { businessId: business.id },
    });
  };
  // UI
  if (hidden) return null;
  return (
    <View style={[{}, style]} {...props}>
      {appjustoOnly || discount ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: paddings.lg,
            paddingVertical: paddings.md,
          }}
        >
          {appjustoOnly ? <AppJustoOnlyIcon /> : <DiscountIcon />}
          <DefaultText style={{ marginHorizontal: paddings.md }} size="xs" color="neutral700">
            {appjustoOnly
              ? 'Por acreditar em um delivery mais justo, esse restaurante optou por estar apenas no appjusto'
              : `Este restaurante cobra em média ${discount}% mais barato no appjusto comparado com outros apps`}
            .
          </DefaultText>
        </View>
      ) : null}
      <Skeleton.Group show={!coverUrl}>
        <View>
          <Skeleton colors={[colors.neutral50, colors.neutral100]} width={WIDTH} height={HEIGHT}>
            {coverUrl ? (
              <Image
                style={{ height: HEIGHT }}
                contentFit="cover"
                source={{ uri: coverUrl }}
                cachePolicy="none"
              />
            ) : null}
          </Skeleton>
          <BusinessLogo
            style={{
              position: 'absolute',
              alignSelf: 'center',
              left: paddings.lg,
              bottom: -20,
              // borderWidth: 1,
            }}
            businessId={business.id}
            size={100}
          />
        </View>
        <View
          style={{
            marginHorizontal: paddings.lg,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 40,
            }}
          >
            <DefaultText
              style={{ flexWrap: 'wrap', maxWidth: percentOfWidth(70) }}
              size="lg"
            >{`${business.name}`}</DefaultText>
            <LinkButton variant="ghost" onPress={detailHandler}>
              Saber mais
            </LinkButton>
          </View>
          <BusinessItemInfo business={business} />
          <BusinessBadges business={business} style={{ marginTop: paddings.xs }} />
          {business.description ? (
            <DefaultText style={{ marginTop: paddings.lg }} color="neutral700">
              {business.description}
            </DefaultText>
          ) : null}
          {categories?.length && categories?.length > 1 ? (
            <HorizontalSelector
              style={{ marginTop: paddings.lg }}
              data={categories.map((value) => ({ title: value }))}
              selectedIndex={categoryIndex}
              size="sm"
              onSelect={onCategorySelect}
            />
          ) : null}
        </View>
      </Skeleton.Group>
    </View>
  );
};

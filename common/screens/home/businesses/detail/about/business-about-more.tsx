import { DefaultText } from '@/common/components/texts/DefaultText';
import { cepFormatter } from '@/common/formatters/cep';
import paddings from '@/common/styles/paddings';
import { PublicBusiness, WithId } from '@appjusto/types';
import * as cnpjutils from '@fnando/cnpj';
import { View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  business: WithId<PublicBusiness> | undefined | null;
}

export const BussinessAboutMore = ({ business, style, ...props }: Props) => {
  if (!business) return;
  const { businessAddress } = business;
  if (!businessAddress) return null;
  let address = businessAddress.address;
  if (businessAddress.number) address += ', ' + businessAddress.number;
  const city = businessAddress.city + ', ' + businessAddress.state;
  return (
    <View style={[{}, style]} {...props}>
      <DefaultText size="md">Endereço</DefaultText>
      <DefaultText style={{ marginTop: paddings.xs }} color="neutral700">
        {address}
      </DefaultText>
      <DefaultText style={{ marginTop: paddings.xs }} color="neutral700">
        {city}
      </DefaultText>
      <DefaultText style={{ marginTop: paddings.xs }} color="neutral700">
        {`CEP: ${cepFormatter(businessAddress.cep)}`}
      </DefaultText>
      {business.cnpj ? (
        <View style={{ marginTop: paddings['2xl'] }}>
          <DefaultText size="md">CNPJ</DefaultText>
          <DefaultText style={{ marginTop: paddings.xs }} color="neutral700">
            {cnpjutils.format(business.cnpj)}
          </DefaultText>
        </View>
      ) : null}
    </View>
  );
};

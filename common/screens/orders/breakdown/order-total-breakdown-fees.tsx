import { DefaultText } from '@/common/components/texts/DefaultText';
import { formatCurrency } from '@/common/formatters/currency';
import colors, { ColorName } from '@/common/styles/colors';
import lineHeight from '@/common/styles/lineHeight';
import paddings from '@/common/styles/paddings';
import { Order } from '@appjusto/types';
import { ChevronDown, Info } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View, ViewProps } from 'react-native';
import IzaIcon from './iza-icon';

interface ItemProps extends ViewProps {
  title: string;
  value: number;
  color?: ColorName;
}

const Item = ({ title, value, color = 'neutral800', style, ...props }: ItemProps) => (
  <View
    style={[
      { flexDirection: 'row', justifyContent: 'space-between', marginTop: paddings.xs },
      style,
    ]}
    {...props}
  >
    <DefaultText color={color}>{title}</DefaultText>
    <DefaultText color={color}>{formatCurrency(value)}</DefaultText>
  </View>
);

interface Props extends ViewProps {
  order: Order;
}

export const OrderTotalBreakdownFees = ({ order, style, ...props }: Props) => {
  // state
  const [opened, setOpened] = useState(false);
  const deliveryFinancialFee = order.fare?.courier?.processing?.fee.percent;
  const deliveryFinancialValue =
    order.fare?.courier?.processing?.value && order.fare.courier.payee !== 'business'
      ? order.fare?.courier?.processing?.value
      : 0;
  const insurance = order.fare?.courier?.insurance;
  const highDemandFee = order.fare?.courier?.locationFee ?? 0;
  const credits = order.fare?.credits ?? 0;
  if (!deliveryFinancialValue && !insurance && !highDemandFee && !credits) return null;
  // UI
  return (
    <View
      style={[
        { paddingHorizontal: paddings.lg, paddingVertical: paddings.xl, borderWidth: 0 },
        style,
      ]}
      {...props}
    >
      <Pressable onPress={() => setOpened((value) => !value)}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Info size={20} color={colors.neutral800} />
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginLeft: paddings.md,
            }}
          >
            <DefaultText>Entenda nossas taxas</DefaultText>
            <ChevronDown size={16} color={colors.neutral800} />
          </View>
        </View>
        {opened ? (
          <View>
            {/* financial fees */}
            {deliveryFinancialFee && deliveryFinancialValue ? (
              <View style={{ marginTop: paddings.lg }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <DefaultText size="md" color="neutral900">
                    Tarifa financeira
                  </DefaultText>
                  <DefaultText color="neutral900">
                    {formatCurrency(deliveryFinancialValue)}
                  </DefaultText>
                </View>
                <DefaultText
                  style={{ marginTop: paddings.sm, ...lineHeight.sm }}
                  color="neutral800"
                >
                  {`Esse valor é o custo financeiro da transação (${deliveryFinancialFee}%) que acrescemos ao valor da entrega para que o entregador receba o valor líquido.`}
                </DefaultText>
              </View>
            ) : null}
            {/* insurance */}
            {insurance ? (
              <View style={{ marginTop: paddings.xl }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row' }}>
                    <DefaultText size="md" color="neutral900">
                      Seguro
                    </DefaultText>
                    <IzaIcon style={{ marginLeft: paddings.sm }} />
                  </View>
                  <DefaultText color="neutral900">{formatCurrency(insurance)}</DefaultText>
                </View>
                <DefaultText
                  style={{ marginTop: paddings.sm, ...lineHeight.sm }}
                  color="neutral800"
                >
                  Durante esta corrida o entregador da rede AppJusto estará coberto pelo seguro
                  contra acidentes Iza.
                </DefaultText>
              </View>
            ) : null}
            {/* high demand fee */}
            {highDemandFee ? (
              <View style={{ marginTop: paddings.lg }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <DefaultText size="md" color="black">
                    Taxa de alta demanda
                  </DefaultText>
                  <DefaultText color="black">{formatCurrency(highDemandFee)}</DefaultText>
                </View>
                <DefaultText
                  style={{ marginTop: paddings.sm, ...lineHeight.sm }}
                  color="neutral800"
                >
                  Em momentos de alta demanda, as plataformas incluem valores extras para garantir
                  que o pedido seja coletado. Esse valor é baseado no valor de marcado do momento e
                  é repassado integralmente para o entregador.
                </DefaultText>
              </View>
            ) : null}
            {/* credits */}
            {credits ? (
              <View style={{ marginTop: paddings.lg }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <DefaultText size="md" color="primary900">
                    Créditos
                  </DefaultText>
                  <DefaultText color="primary900">{formatCurrency(credits)}</DefaultText>
                </View>
                <DefaultText
                  style={{ marginTop: paddings.sm, ...lineHeight.sm }}
                  color="neutral800"
                >
                  Crédito referente à diferença do valor da corrida rede appjusto vs corrida fora da
                  rede. Como exceção, precisamos às vezes contar com entregadores externos - e
                  estamos trabalhando pra que isso aconteça cada vez menos!
                </DefaultText>
              </View>
            ) : null}
          </View>
        ) : null}
      </Pressable>
    </View>
  );
};

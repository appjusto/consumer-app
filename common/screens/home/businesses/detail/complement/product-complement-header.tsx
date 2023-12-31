import { DefaultText } from '@/common/components/texts/DefaultText';
import { RoundedText } from '@/common/components/texts/RoundedText';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { ComplementGroup } from '@appjusto/types';
import React from 'react';
import { View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  group: ComplementGroup;
  totalSelected: number;
}

export const ProductComplementHeader = ({ group, totalSelected, style, ...props }: Props) => {
  const { required } = group;
  // UI
  return (
    <View style={[{}, style]}>
      <View style={{ flexDirection: 'row' }}>
        <DefaultText size="md">{group.name}</DefaultText>
        <RoundedText
          style={{
            marginLeft: paddings.lg,
            backgroundColor: required ? colors.info100 : colors.neutral50,
          }}
          size="xs"
          color={required ? 'info900' : 'neutral800'}
        >
          {required ? 'Obrigatório' : 'Opcional'}
        </RoundedText>
      </View>
      <DefaultText
        style={{ marginTop: paddings.sm }}
        size="xs"
        color="neutral700"
      >{`${totalSelected} de ${group.maximum} selecionado${
        totalSelected > 1 ? 's' : ''
      }`}</DefaultText>
    </View>
  );
};

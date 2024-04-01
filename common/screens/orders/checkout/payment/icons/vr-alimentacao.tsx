import { Image } from 'expo-image';
import React from 'react';

const VRAlimentacaoLogo = require('../../../../../../assets/images/cards/vr-alimentacao.png');

export const VRAlimentacao = () => (
  <Image source={VRAlimentacaoLogo} style={{ width: 40, height: 24 }} />
);

import { VRPayableWith } from '@appjusto/types';
import creditCardType from 'credit-card-type';

creditCardType.addCard({
  niceType: 'VR Refeição',
  type: 'vr-refeição' as VRPayableWith,
  patterns: [627416, 637202],
  gaps: [4, 8, 12],
  lengths: [16],
  code: {
    name: 'CVV',
    size: 3,
  },
});

creditCardType.addCard({
  niceType: 'VR Alimentação',
  type: 'vr-alimentação' as VRPayableWith,
  patterns: [637036],
  gaps: [4, 8, 12],
  lengths: [16],
  code: {
    name: 'CVV',
    size: 3,
  },
});

export const cardType = creditCardType;

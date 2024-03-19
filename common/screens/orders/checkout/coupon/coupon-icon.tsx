import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';
export const CouponIcon = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" {...props}>
    <Path
      stroke="#0C0A09"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4.001 4.001 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4.001 4.001 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76ZM15 9l-6 6m0-6h.01M15 15h.01"
    />
  </Svg>
);

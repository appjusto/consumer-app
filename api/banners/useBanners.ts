import { useContextApi } from '@/api/ApiContext';
import { Banner, WithId } from '@appjusto/types';
import React from 'react';

export const useBanners = () => {
  // context
  const api = useContextApi();
  // state
  const [banners, setBanners] = React.useState<WithId<Banner>[]>();
  // side effects
  React.useEffect(() => {
    return api.banner().observeBanners(setBanners);
  }, [api]);
  // result
  return banners;
};

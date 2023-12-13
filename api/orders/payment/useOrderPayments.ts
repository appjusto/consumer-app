import { useContextBusiness } from '@/api/business/context/business-context';
import { useContextPlatformParams } from '@/api/platform/context/PlatformContext';
import { useContextProfile } from '@/common/auth/AuthContext';
import { PayableWith } from '@appjusto/types';
import { useEffect, useState } from 'react';

export const useOrderPayments = () => {
  // context
  const platformParams = useContextPlatformParams();
  const profile = useContextProfile();
  const acceptedByPlatform = platformParams?.acceptedPaymentMethods;
  const defaultPaymentMethod = profile ? profile.defaultPaymentMethod ?? null : undefined;
  const defaultPaymentMethodId = profile?.defaultPaymentMethodId;
  const business = useContextBusiness();
  // state
  const [acceptedOnOrder, setAcceptedOnOrder] = useState<PayableWith[]>();
  useEffect(() => {
    if (profile?.tags?.includes('unsafe')) {
      setAcceptedOnOrder(['pix']);
      return;
    }
    if (!acceptedByPlatform) return;
    if (business === undefined) return;
    if (business === null) {
      setAcceptedOnOrder(
        acceptedByPlatform.filter((value) => value !== 'vr-alimentação' && value !== 'vr-refeição')
      );
    } else {
      setAcceptedOnOrder(
        acceptedByPlatform.filter((value) => business.acceptedPaymentMethods?.includes(value))
      );
    }
  }, [profile, acceptedByPlatform, business]);
  // result
  return {
    acceptedByPlatform,
    acceptedOnOrder,
    defaultPaymentMethod,
    defaultPaymentMethodId,
  };
};

import { useContextPlatformParams } from '@/api/platform/context/platform-context';
import { useContextProfile } from '@/common/auth/AuthContext';
import { customAlphabet } from 'nanoid/non-secure';

const nanoid = customAlphabet('23456789ABCDEFGHJKLMNPQRSTUVWXYZ', 7);

export const useTicketAuthURL = () => {
  // context
  const params = useContextPlatformParams();
  const consumerId = useContextProfile()?.id;
  // result
  const getAuthURL = () => {
    const state = consumerId ?? '';
    const nonce = nanoid();
    const ticket = params?.ticket ?? {
      authenticationURL: '',
      clientId: '',
      authenticationRedirectURL: '',
    };
    const url = new URL(`${ticket.authenticationURL}/connect/authorize`);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', 'openid edg-xp-mealdelivery-api offline_access');
    url.searchParams.set('acr_values', 'tenant:br-ben');
    url.searchParams.set('ui_locales', 'pt');
    url.searchParams.set('client_id', ticket.clientId);
    url.searchParams.set('redirect_uri', ticket.authenticationRedirectURL);
    url.searchParams.set('state', state);
    url.searchParams.set('nonce', nonce);
    return url.toString();
  };
  return getAuthURL;
};

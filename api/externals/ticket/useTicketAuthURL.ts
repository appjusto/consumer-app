import { useContextPlatformParams } from '@/api/platform/context/platform-context';
import { useContextProfile } from '@/common/auth/AuthContext';
import { customAlphabet } from 'nanoid/non-secure';
import { useEffect, useState } from 'react';

const nanoid = customAlphabet('23456789ABCDEFGHJKLMNPQRSTUVWXYZ', 7);

export const useTicketAuthURL = () => {
  // context
  const params = useContextPlatformParams();
  const consumerId = useContextProfile()?.id;
  // state
  const [ticketAuthUrl, setTicketAuthUrl] = useState<string>();
  // side effects
  useEffect(() => {
    if (!params?.ticket) return;
    if (!consumerId) return;
    if (ticketAuthUrl) return;
    const state = consumerId;
    const nonce = nanoid();
    const url = new URL(`${params.ticket.authenticationURL}/connect/authorize`);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', 'openid edg-xp-mealdelivery-api offline_access');
    url.searchParams.set('acr_values', 'tenant:br-ben');
    url.searchParams.set('ui_locales', 'pt');
    url.searchParams.set('client_id', params.ticket.clientId);
    url.searchParams.set('redirect_uri', params.ticket.authenticationRedirectURL);
    url.searchParams.set('state', state);
    url.searchParams.set('nonce', nonce);
    setTicketAuthUrl(url.toString());
  }, [params, consumerId, ticketAuthUrl]);
  // result
  return ticketAuthUrl;
};

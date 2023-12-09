import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import {
  useContextIsUserAnonymous,
  useContextProfile,
  useContextUserLogged,
} from '@/common/auth/AuthContext';
import { Loading } from '@/common/components/views/Loading';
import { useSafeRouter } from '@/common/deeplink/useSafeRouter';
import { useEffect } from 'react';

export default function Index() {
  // context
  const router = useSafeRouter();
  const logged = useContextUserLogged();
  const isAnonymous = useContextIsUserAnonymous();
  const profile = useContextProfile();
  // state
  const situation = profile === null ? null : profile?.situation;
  // side effects
  useTrackScreenView('Index');
  // routing
  useEffect(() => {
    if (!router) return;
    if (!logged) return;
    // if (isAnonymous) router.replace('/(unlogged)/welcome');
    if (isAnonymous) router.replace('/(logged)/(tabs)/(home)/');
    else if (situation === 'approved') router.replace('/(logged)/(tabs)/(home)/');
  }, [situation, logged, isAnonymous, router]);
  // UI
  return <Loading />;
}

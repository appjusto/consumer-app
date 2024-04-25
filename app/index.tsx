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
    // console.log('index', isAnonymous, situation);
    // if (isAnonymous) router.replace('/(logged)/(tabs)/(home)/');
    if (isAnonymous) router.replace('/(unlogged)/welcome');
    else if (situation === 'approved') router.replace('/(logged)/(tabs)/(home)/');
    console.log(situation);
  }, [situation, logged, isAnonymous, router]);
  // UI
  return <Loading />;
}

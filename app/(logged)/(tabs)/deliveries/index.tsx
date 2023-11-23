import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useObserveOrdersOfLast24h } from '@/api/orders/useObserveOrdersOfLast24h';
import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import { LinkButton } from '@/common/components/buttons/link/LinkButton';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import { Loading } from '@/common/components/views/Loading';
import { OrderList } from '@/common/screens/orders/list/order-list';
import borders from '@/common/styles/borders';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { useRouter } from 'expo-router';

export default function DeliveriesIndex() {
  // context
  const router = useRouter();
  // state
  // const entries = useObserveApprovedEntries();
  const orders = useObserveOrdersOfLast24h();
  // tracking
  useTrackScreenView('Suas corridas');
  // UI
  // if (!entries) return <Loading />;
  if (!orders) return <Loading />;
  return (
    <DefaultScrollView style={{ ...screens.default }}>
      <DefaultView style={{ ...screens.headless, padding: paddings.lg }}>
        <OrderList
          style={{ marginTop: paddings.lg, ...borders.default, borderColor: colors.neutral100 }}
          title="Corridas nas últimas 24h"
          emptyText="Não encontramos nenhuma corrida neste período."
          orders={orders}
        >
          {/* <LedgerEntriesList
          style={{ marginTop: paddings.sm }}
          title="Seus últimos ganhos"
          emptyText="Ops! Não encontramos nenhum ganho recente. Bora ficar disponível e
          pegar umas corridas?"
          entries={entries}
        > */}
          <DefaultButton
            style={{ marginTop: paddings.lg }}
            title="Ver histórico de corridas"
            size="sm"
            variant="outline"
            onPress={() => router.push('/deliveries/orders')}
          />
          <LinkButton
            style={{ marginTop: paddings.sm, alignSelf: 'center' }}
            variant="ghost"
            onPress={() => router.push('/deliveries/ledger')}
          >
            Ver todos os ganhos
          </LinkButton>
          {/* </LedgerEntriesList> */}
        </OrderList>
      </DefaultView>
    </DefaultScrollView>
  );
}

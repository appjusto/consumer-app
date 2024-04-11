import { useContextBusiness } from '@/api/business/context/business-context';
import { getBusinessAvailability } from '@/api/business/range/getBusinessAvailability';
import { inDeliveryRange } from '@/api/business/range/inDeliveryRange';
import {
  useContextGetServerTime,
  useContextPlatformAccess,
} from '@/api/platform/context/platform-context';
import { useIsDuringWorkingHours } from '@/api/platform/time/useIsDuringWorkingHours';
import { useContextCurrentLocation } from '@/api/preferences/context/PreferencesContext';
import { useContextProfile } from '@/common/auth/AuthContext';
import { useContextOrder, useContextOrderBusiness } from '../context/order-context';

export type CheckoutIssueType =
  | 'platform-under-maintenance'
  | 'platform-out-of-service-hours'
  | 'business-unavailable'
  | 'business-out-of-range'
  | 'route-invalid'
  | 'schedule-required';

export interface CheckoutIssue {
  type: CheckoutIssueType;
  description: string;
}

export const useCheckoutIssues = () => {
  // context
  const access = useContextPlatformAccess();
  const isDuringWorkingHours = useIsDuringWorkingHours();
  const quote = useContextOrder();
  const profile = useContextProfile();
  const currentLocation = useContextCurrentLocation();
  const business = useContextBusiness();
  const orderBusiness = useContextOrderBusiness();
  const getServerTime = useContextGetServerTime();
  // state
  // platform
  const issues: CheckoutIssue[] = [];
  if (access?.maintenance?.active) {
    issues.push({
      type: 'platform-under-maintenance',
      description: access.maintenance.body?.length
        ? access.maintenance.body.join(' ')
        : 'Estamos em manutenção no momento. Voltaremos em breve!',
    });
  }
  if (!isDuringWorkingHours) {
    issues.push({
      type: 'platform-out-of-service-hours',
      description: 'Nosso horário de atendimento é entre às 07:00 e 00:00.',
    });
  }
  // business
  let availability = business ? getBusinessAvailability(business, getServerTime()) : null;
  if (business) {
    if (business.status === 'unavailable') {
      issues.push({
        type: 'business-unavailable',
        description: 'O restaurante não está disponível no momento',
      });
    }
    if (!inDeliveryRange(business, currentLocation)) {
      issues.push({
        type: 'business-out-of-range',
        description: 'Sua localização está fora da área de entrega do restaurante.',
      });
    }
    if (availability === 'closed') {
      issues.push({
        type: 'business-unavailable',
        description: 'O restaurante não está disponível no momento',
      });
    }
  }
  // order
  if (!quote) return issues;
  if (quote.route?.issue) {
    issues.push({ type: 'route-invalid', description: quote.route.issue });
  }
  availability = orderBusiness ? getBusinessAvailability(orderBusiness, getServerTime()) : null;
  if (orderBusiness) {
    console.log('availability', availability, quote.scheduledTo);
    if (availability === 'schedule-required' && !quote.scheduledTo) {
      issues.push({
        type: 'schedule-required',
        description: 'No momento, o restaurante só está aceitando pedidos agendados.',
      });
    }
  }

  // result
  return issues;
};

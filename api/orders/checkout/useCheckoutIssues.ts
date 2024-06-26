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
import { isProfileValid } from '@/common/profile/isProfileValid';
import { useContextOrder, useContextOrderBusiness } from '../context/order-context';

export type CheckoutIssueType =
  | 'platform-under-maintenance'
  | 'platform-out-of-service-hours'
  | 'business-unavailable'
  | 'business-out-of-range'
  | 'route-invalid'
  | 'schedule-required'
  | 'profile-incomplete';

export interface CheckoutIssue {
  type: CheckoutIssueType;
  description: string;
}

export const useCheckoutIssues = (checkSchedule: boolean, checkProfile: boolean) => {
  // context
  const getServerTime = useContextGetServerTime();
  const access = useContextPlatformAccess();
  const isDuringWorkingHours = useIsDuringWorkingHours();
  const profile = useContextProfile();
  const currentLocation = useContextCurrentLocation();
  const business = useContextBusiness();
  const quote = useContextOrder();
  const orderBusiness = useContextOrderBusiness();
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
  // profile
  if (checkProfile) {
    if (!isProfileValid(profile)) {
      issues.push({
        type: 'profile-incomplete',
        description: 'Você precisa completar seu cadastro antes de concluir seu pedido.',
      });
    }
  }
  // order
  if (!quote) return issues;
  if (quote.route?.issue) {
    issues.push({ type: 'route-invalid', description: quote.route.issue });
  }
  if (checkSchedule) {
    availability = orderBusiness ? getBusinessAvailability(orderBusiness, getServerTime()) : null;
    if (!quote.scheduledTo) {
      // console.log('availability', availability, quote.scheduledTo);
      if (availability === 'schedule-required-always') {
        issues.push({
          type: 'schedule-required',
          description: 'Agende um horário para pedir neste restaurante.',
        });
      } else if (availability === 'schedule-required') {
        issues.push({
          type: 'schedule-required',
          description: 'No momento, este restaurante só está aceitando pedidos agendados.',
        });
      }
    }
  }

  // result
  return issues;
};

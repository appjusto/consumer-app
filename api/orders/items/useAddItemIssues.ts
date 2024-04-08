import { useContextBusiness } from '@/api/business/context/business-context';
import { getBusinessAvailability } from '@/api/business/range/getBusinessAvailability';
import { inDeliveryRange } from '@/api/business/range/inDeliveryRange';
import {
  useContextGetServerTime,
  useContextPlatformAccess,
} from '@/api/platform/context/platform-context';
import { useIsDuringWorkingHours } from '@/api/platform/time/useIsDuringWorkingHours';
import { useContextCurrentLocation } from '@/api/preferences/context/PreferencesContext';

export type AddItemIssueType =
  | 'platform-under-maintenance'
  | 'platform-out-of-service-hours'
  | 'business-unavailable'
  | 'business-out-of-range';

export interface AddItemIssue {
  type: AddItemIssueType;
  description: string;
}

export const useAddItemIssues = () => {
  // context
  const access = useContextPlatformAccess();
  const isDuringWorkingHours = useIsDuringWorkingHours();
  const business = useContextBusiness();
  const currentLocation = useContextCurrentLocation();
  const getServerTime = useContextGetServerTime();
  // state
  const issues: AddItemIssue[] = [];
  // validations
  // plataform under maintenance
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
    const availability = getBusinessAvailability(business, getServerTime());
    if (availability === 'closed') {
      issues.push({
        type: 'business-unavailable',
        description: 'O restaurante não está disponível no momento',
      });
    }
  }
  // result
  return issues;
};

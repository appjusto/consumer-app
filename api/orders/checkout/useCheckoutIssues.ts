import { useContextProfile } from '@/common/auth/AuthContext';
import { isProfileValid } from '@/common/profile/isProfileValid';
import { useContextOrder, useContextOrderBusiness } from '../context/order-context';

export type CheckoutIssue = 'profile-incomplete' | 'route-invalid';

export const useCheckoutIssues = () => {
  // context
  const quote = useContextOrder();
  const profile = useContextProfile();
  const business = useContextOrderBusiness();
  // state
  const issues: CheckoutIssue[] = [];
  // validations
  if (!quote) return issues;
  if (!isProfileValid(profile)) issues.push('profile-incomplete');
  if (quote.route?.issue) issues.push('route-invalid');
  // result
  return issues;
};

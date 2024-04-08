import { useContextProfile } from '@/common/auth/AuthContext';
import { isProfileValid } from '@/common/profile/isProfileValid';
import { useContextOrder } from '../context/order-context';

export type CheckoutIssueType = 'profile-incomplete' | 'route-invalid';

export interface CheckoutIssue {
  type: CheckoutIssueType;
  description: string;
}

export const useCheckoutIssues = () => {
  // context
  const quote = useContextOrder();
  const profile = useContextProfile();
  // state
  const issues: CheckoutIssue[] = [];
  // validations
  if (!isProfileValid(profile)) {
    issues.push({
      type: 'profile-incomplete',
      description: 'Você precisa completar seu cadastro antes de concluir seu pedido.',
    });
  }
  if (!quote) return issues;
  if (quote.route?.issue) {
    issues.push({ type: 'route-invalid', description: quote.route.issue });
  }
  // result
  return issues;
};

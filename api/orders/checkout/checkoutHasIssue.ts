import { CheckoutIssue, CheckoutIssueType } from './useCheckoutIssues';

export const checkoutHasIssue = (issues: CheckoutIssue[], type: CheckoutIssueType) => {
  return issues.some((issue) => issue.type === type);
};

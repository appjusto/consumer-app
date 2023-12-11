import { serverTimestamp } from '@/common/firebase/serverTimestamp';
import { Order, Place, PublicBusiness, WithId } from '@appjusto/types';

export const addBusinessToOrder = (
  order: Partial<Order>,
  business: WithId<PublicBusiness>
): Partial<Order> => {
  const businessAddress = business.businessAddress!;
  const { address, number, neighborhood, city, additional, instructions } = businessAddress;
  const main = `${address}, ${number}`;
  const secondary = `${neighborhood ? `${neighborhood} - ` : ''}${city}`;
  const origin: Place = {
    address: {
      main,
      secondary,
      description: `${main} - ${secondary}`,
    },
    additionalInfo: additional ?? '',
    instructions: instructions ?? '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  return {
    ...order,
    origin,
    business: {
      id: business.id,
      name: business.name ?? '',
      cusine: business.cuisine ?? '',
    },
  };
};

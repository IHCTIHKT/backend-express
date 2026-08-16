import { faker } from '@faker-js/faker';

export type OrderMock = {
  id: number;
  name: string;
  order: string;
};

export const getMockOrder = (maxCount?: number) => {
  const createMockOrder = () => ({
    id: faker.number.int({ min: 1, max: 1000 }),
    name: faker.lorem.words({ min: 1, max: 5 }),
    order: faker.lorem.paragraph({ min: 1, max: 3 }),
  });

  if (!maxCount || maxCount === 1) {
    return createMockOrder();
  }

  const orders = [];

  for (let i = 0; i < maxCount; i++) {
    orders.push(createMockOrder());
  }
  return orders;
};

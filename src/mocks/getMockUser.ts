import { faker } from '@faker-js/faker';

export type TaskMock = {
  id: number;
  title: string;
  description: string;
};

export const getMockTask = (maxCount?: number) => {
  const createMockTask = () => ({
    id: faker.number.int({ min: 1, max: 1000 }),
    title: faker.lorem.words({ min: 1, max: 5 }),
    description: faker.lorem.paragraph({ min: 1, max: 3 }),
  });

  if (!maxCount || maxCount === 1) {
    return createMockTask();
  }
};

const tasks = [];
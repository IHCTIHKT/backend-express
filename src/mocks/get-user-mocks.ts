import { faker } from '@faker-js/faker';

export type UserMock = {
  id: number;
  name: string;
  login: string;
  password: string;
};

export function getMockUser(): UserMock {
  return {
    id: faker.number.int({ min: 1, max: 1000 }),
    name: faker.person.firstName(),
    login: faker.internet.username(),
    password: faker.internet.password({
      length: faker.number.int({ min: 5, max: 32 }),
    }),
  };
}

getMockUser();
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const user = {
  name: 'Alex',
  city: 'Espoo',
}

const action = [
  {
    name: 'React',
    field: 'Курсы',
  }
];

const main = async () => {
  await prisma.$connect();
  await prisma.user.create({ data: user });
  await prisma.action.create({ data: action });
  await prisma.$disconnect();
}

main();

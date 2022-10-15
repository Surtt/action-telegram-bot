import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface IUser {
  name: string;
  city: string;
}

interface IAction {
  name: string;
  field: string;
}

const user: IUser = {
  name: 'Alex',
  city: 'Espoo',
}

const action: IAction = {
    name: 'React',
    field: 'Курсы',
};

const main = async () => {
  await prisma.$connect();
  await prisma.user.create({ data: user });
  await prisma.action.create({ data: action });
  await prisma.$disconnect();
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  });

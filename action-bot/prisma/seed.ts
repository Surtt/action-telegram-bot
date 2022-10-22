import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface IUser {
  userId: number;
  name: string;
  city: string;
  categories: string[];
}

interface IAction {
  title: string;
  text: string;
  startDay: Date;
  endDay: Date;
  city: string;
  tags: string[];
  category: string;
}

const user: IUser = {
  userId: 12345678,
  name: 'Alex',
  city: 'Espoo',
  categories: [],
}

const action: IAction = {
  title: 'React',
  text: 'Прекрасный курс по React',
  startDay: new Date(),
  endDay: new Date(),
  city: 'Москва',
  tags: ['Курсы', 'React'],
  category: 'Курсы',
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

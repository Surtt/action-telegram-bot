import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface IUser {
  userId: number;
  name: string;
  city: string;
  categories: string[];
  actions: IAction[];
}

interface IAction {
  title: string;
  text: string;
  startDay: string;
  endDay: string;
  city: string;
  tags: string[];
  field: string;
}

const user: IUser = {
  userId: 12345678,
  name: 'Alex',
  city: 'Espoo',
  categories: ['Курсы', 'Одежда'],
  actions: [
    {
      title: 'React',
      text: 'Прекрасный курс по React',
      startDay: '12.10.2022',
      endDay: '12.11.2022',
      city: 'Москва',
      tags: ['Курсы', 'React'],
      field: 'Курсы',
    }
  ],
}

const action: IAction = {
  title: 'React',
  text: 'Прекрасный курс по React',
  startDay: '12.10.2022',
  endDay: '12.11.2022',
  city: 'Москва',
  tags: ['Курсы', 'React'],
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

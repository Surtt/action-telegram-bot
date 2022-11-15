import {getPrismaClient} from "../helpers/get-prisma-client.js";

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
  startDay: new Date('2022-10-20T19:27:10.065Z'),
  endDay: new Date('2023-12-15T19:27:10.065Z'),
  city: 'Москва',
  tags: ['Курсы', 'React'],
  category: 'Курсы',
};

const actionClothes: IAction = {
  title: 'Рубашка',
  text: 'Красивая рубашка',
  startDay: new Date('2022-05-17T19:27:10.065Z'),
  endDay: new Date('2022-11-25T19:27:10.065Z'),
  city: 'Москва',
  tags: ['Одежда', 'Рубашка'],
  category: 'Одежда',
};

const actionElectronics: IAction = {
  title: 'Телефон',
  text: 'Дорогой телефон',
  startDay: new Date('2022-07-22T19:27:10.065Z'),
  endDay: new Date('2022-10-11T19:27:10.065Z'),
  city: 'Москва',
  tags: ['Электроника', 'Телефон'],
  category: 'Электроника',
};

const actionFood: IAction = {
  title: 'Хлеб',
  text: 'Вкусный хлеб',
  startDay: new Date('2022-08-21T19:27:10.065Z'),
  endDay: new Date('2022-09-12T19:27:10.065Z'),
  city: 'Москва',
  tags: ['Продукты', 'Хлеб'],
  category: 'Продукты',
};

const categories = [
  {
    name: 'Курсы',
  },
  {
    name: 'Одежда',
  },
  {
    name: 'Электроника',
  },
  {
    name: 'Продукты',
  },
];

const main = async () => {
  const { prisma } = getPrismaClient();
  await prisma.$connect();
  await prisma.user.create({ data: user });
  await prisma.category.createMany({ data: categories});
  await prisma.action.create({ data: action });
  await prisma.action.create({ data: actionClothes });
  await prisma.action.create({ data: actionElectronics });
  await prisma.action.create({ data: actionFood });
  await prisma.$disconnect();
}

main();

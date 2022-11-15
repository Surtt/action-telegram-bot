import 'dotenv/config';
import { Scenes, Telegraf } from "telegraf";
import LocalSession from 'telegraf-session-local';
import { MyContext } from "./types";
import { greeterScene } from "./scenes/greeter-scene.js";
import { cityScene } from "./scenes/city-scene.js";
import { categoriesScene } from "./scenes/categories-scene.js";
import { changeCityScene } from "./scenes/change-city-scene.js";
import { settingsScene } from "./scenes/settings-scene.js";
import { getUsersCategories } from "./scenes/get-users-categories.js";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const init = async () => {
  await prisma.$connect();
  const token = process.env.TOKEN;

  if (!token) {
    throw new Error('Не задан токен');
  }

  const bot = new Telegraf<MyContext>(token);

  const stage = new Scenes.Stage<MyContext>([greeterScene(), cityScene(prisma), categoriesScene(), changeCityScene(prisma), settingsScene(), getUsersCategories(prisma)]);

  bot.use(new LocalSession({database: 'session.json'}).middleware());
  bot.use(stage.middleware());
  bot.use((ctx, next) => {
    ctx.myContextProp ??= '';
    ctx.session.cityProp ??= '';
    ctx.session.userProp ??= ctx?.from?.id;
    ctx.scene.session.mySceneSessionProp ??= '';
    return next();
  });
  bot.command("start", (ctx) => ctx.scene.enter("greeter"));
  bot.command("city", (ctx) => ctx.scene.enter("changeCity"));
  bot.command('settings', (ctx) => ctx.scene.enter('settings'));
  await bot.telegram.setMyCommands([
    { command: '/start', description: 'Начать диалог' },
    { command: '/city', description: 'Изменить город' },
    { command: '/settings', description: 'Открыть настройки' },
  ]);

  bot.on("message", ctx => ctx.reply("Такой команды нет, попробуй /start"));

  await bot.launch();
}

init()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
  });


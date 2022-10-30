import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Scenes, Telegraf, Markup } from "telegraf";
import LocalSession from 'telegraf-session-local';
import { MyContext } from "./types";
import { greeterScene } from "./scenes/greeterScene.js";
import { cityScene } from "./scenes/cityScene.js";
import { categoriesScene } from "./scenes/categoriesScene.js";
import { changeCityScene } from "./scenes/changeCityScene.js";
import dedent from "dedent-js";

const prisma = new PrismaClient();
const {leave, enter} = Scenes.Stage;

const init = async () => {
  const token = process.env.TOKEN;

  if (!token) {
    throw new Error('Не задан токен');
  }

  const bot = new Telegraf<MyContext>(token);

  const stage = new Scenes.Stage<MyContext>([greeterScene(), cityScene(), categoriesScene(), changeCityScene()]);

  bot.use(new LocalSession({database: 'session.json'}).middleware());
  bot.use(stage.middleware());
  bot.use((ctx, next) => {
    ctx.myContextProp ??= '';
    ctx.session.cityProp ??= '';
    ctx.session.userProp ??= ctx?.from?.id;
    ctx.scene.session.mySceneSessionProp ??= '';
    return next();
  });
  bot.command("start", ctx => ctx.scene.enter("greeter"));
  bot.command("city", ctx => ctx.scene.enter("changeCity"));


  bot.hears('Рассылка', async (ctx) => {
      // sending mail
    const action = await prisma.action.create({ data: {
        title: 'React Query',
        text: 'Прекрасный курс по React Query',
        startDay: new Date('2022-10-20T19:27:10.065Z'),
        endDay: new Date('2023-12-15T19:27:10.065Z'),
        city: 'Москва',
        tags: ['Курсы', 'React Query'],
        category: 'Курсы',
      }});
      ctx.replyWithHTML(
          dedent`
          <b>📚 Название:</b> ${action.title}
          
          <b>💬 Описание:</b> ${action.text}
          
          <b>🏢 Город:</b> ${action.city}
          
          <b>🏁 Дата начала акции:</b> ${action.startDay.toLocaleDateString('ru-RU')}
          
          <b>🏁 Дата окончания акции:</b> ${action.endDay.toLocaleDateString('ru-RU')}
          
          <b>🏷 Теги:</b> ${action.tags.map((t) => `#${t}`).join(' ')}
          `);
  });

    bot.on("message", ctx => ctx.reply("Такой команды нет, попробуй /start"));

  bot.launch();
  await prisma.$connect();
}

init()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
  });


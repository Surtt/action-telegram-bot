import 'dotenv/config';
import {Markup, Scenes, Telegraf, Context } from "telegraf";
import LocalSession from 'telegraf-session-local';
import {MyContext} from "./types";
import {greeterScene} from "./scenes/greeter-scene.js";
import {cityScene} from "./scenes/city-scene.js";
import {categoriesScene} from "./scenes/categories-scene.js";
import {getPrismaClient} from "./helpers/get-prisma-client.js";

const {leave, enter} = Scenes.Stage;

const init = async () => {
  const token = process.env.TOKEN;
  const { prisma } = getPrismaClient();

  if (!token) {
    throw new Error('Не задан токен');
  }

  const bot = new Telegraf<MyContext>(token);

  const stage = new Scenes.Stage<MyContext>([greeterScene(), cityScene(), categoriesScene()]);

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
  bot.command("city", ctx => ctx.scene.enter("city"));
  bot.on("message", ctx => ctx.reply("Такой команды нет, попробуй /start"));

  bot.launch();
  await prisma.$connect();
}

init()
  .then(async () => {
    const { prisma } = getPrismaClient();
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    const { prisma } = getPrismaClient();
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
  });


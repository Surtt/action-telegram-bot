import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import {Markup, Scenes, Telegraf, Context } from "telegraf";
import LocalSession from 'telegraf-session-local';

interface MySceneSession extends Scenes.SceneSessionData {
  mySceneSessionProp: string;
}

interface MySession extends Scenes.SceneSession<MySceneSession> {
  mySessionProp: string;
}

interface MyContext extends Context {
  // will be available under `ctx.myContextProp`
  myContextProp: string;

  // declare session type
  session: MySession;
  // declare scene type
  scene: Scenes.SceneContextScene<MyContext, MySceneSession>;
}

const prisma = new PrismaClient();
const {leave, enter} = Scenes.Stage;

class App {
  async init() {
    const token = process.env.TOKEN;

    if (!token) {
      throw new Error('Не задан токен');
    }

    const greeterScene = new Scenes.BaseScene<MyContext>("greeter");
    greeterScene.enter( (ctx) => {
      ctx.reply(`Добрый день, ${ctx?.message?.from.first_name}!`)
      return ctx.scene.enter('city');
    });

    const cityScene = new Scenes.BaseScene<MyContext>('city');
    cityScene.enter((ctx) => {
      ctx.reply('Укажите, пожалуйста, свой город');
    });

    cityScene.on('text', async (ctx) => {
      const name = ctx.message.from.first_name;
      const city = ctx.message.text;
      const userId = ctx.from.id;

      if (!userId) {
        await prisma.user.create({
          data: {
            name,
            city,
            userId,
          }
        });
      } else {
        return ctx.scene.enter('categories');
      }
    });

    const categoriesScene = new Scenes.BaseScene<MyContext>('categories');
    categoriesScene.enter((ctx) => {
      ctx.reply('Выберите категории акций, которые вам интересны', Markup.keyboard([['Курсы', 'Одежда'], ['Электроника', 'Продукты']]).oneTime().resize());
    });

    const bot = new Telegraf<MyContext>(token);

    const stage = new Scenes.Stage<MyContext>([greeterScene, cityScene, categoriesScene]);

    bot.use(new LocalSession({database: 'session.json'}).middleware());
    bot.use(stage.middleware());
    bot.use((ctx, next) => {
      ctx.session.mySessionProp;
      ctx.scene.session.mySceneSessionProp;
      return next();
    });
    bot.command("start", ctx => ctx.scene.enter("greeter"));
    bot.command("echo", ctx => ctx.scene.enter("echo"));
    bot.command("city", ctx => ctx.scene.enter("city"));
    bot.on("message", ctx => ctx.reply("Такой команды нет, попробуй /start"));

    bot.command('action', (ctx) => {
      ctx.reply('test', Markup.keyboard(['Курсы', 'Одежда', 'Электроника', 'Продукты']).oneTime().resize());
    });
    bot.launch();
    await prisma.$connect();
    const allUsers = await prisma.user.findMany({ where: { id: { gte: 1 } }});
    // const allActions = await prisma.action.findMany({ where: { id: { gte: 1 } }})
    console.log(allUsers)
    // console.log(allActions)
  }
}

const app = new App();
app.init()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
  });


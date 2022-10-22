import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import {Markup, Scenes, Telegraf, Context } from "telegraf";
import LocalSession from 'telegraf-session-local';
import dedent from 'dedent-js';

interface MySceneSession extends Scenes.SceneSessionData {
  mySceneSessionProp: string;
}

interface MySession extends Scenes.SceneSession<MySceneSession> {
  cityProp: string;
  userProp: number | undefined;
}

interface MyContext extends Context {
  myContextProp: string;
  session: MySession;
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
    greeterScene.enter( async (ctx) => {
      await ctx.reply(`Добрый день, ${ctx?.message?.from.first_name}!`)
      return await ctx.scene.enter('city');
    });

    const cityScene = new Scenes.BaseScene<MyContext>('city');
    cityScene.enter((ctx) => {
      ctx.reply('Укажите, пожалуйста, свой город');
    });

    cityScene.on('text', async (ctx) => {
      const name = ctx.message.from.first_name;
      const city = ctx.message.text;
      const userId = ctx.from.id;
      await prisma.user.create({
        data: {
          name,
          city,
          userId,
        }
      });
      ctx.session.cityProp = city;
      return await ctx.scene.enter('categories');
    });

    const categoriesScene = new Scenes.BaseScene<MyContext>('categories');
    categoriesScene.enter(async (ctx) => {
      await ctx.reply('Выберите категории акций, которые вам интересны', Markup.keyboard([['Курсы', 'Одежда'], ['Электроника', 'Продукты']]).oneTime().resize());
    });

    categoriesScene.hears('Курсы', async (ctx) => {
      const category = ctx.update.message.text;
      const city = ctx.session.cityProp;
      const userCategories = await prisma.user.findUnique({ where: { userId: ctx.session.userProp}});
      const categories = userCategories?.categories;
      await prisma.user.update({ where: { userId: ctx.session.userProp}, data: { categories: categories?.concat(category)}})
      const actions = await prisma.action.findMany({ where: { category, city }});
      return actions.map((action) => {
        ctx.replyWithHTML(
            dedent`
            <b>📚 Название курса:</b> ${action.title}
            
            <b>💬 Описание:</b> ${action.text}
            
            <b>🏢 Город:</b> ${action.city}
            
            <b>🏁 Дата начала акции:</b> ${action.startDay.toLocaleDateString('ru-RU')}
            
            <b>🏁 Дата окончания акции:</b> ${action.endDay.toLocaleDateString('ru-RU')}
            `);
      })
    });

    const bot = new Telegraf<MyContext>(token);

    const stage = new Scenes.Stage<MyContext>([greeterScene, cityScene, categoriesScene]);

    bot.use(new LocalSession({database: 'session.json'}).middleware());
    bot.use(stage.middleware());
    bot.use((ctx, next) => {
      ctx.myContextProp ??= "";
      ctx.session.cityProp ??= '';
      ctx.session.userProp ??= ctx?.from?.id;
      ctx.scene.session.mySceneSessionProp ??= '';
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
    const allActions = await prisma.action.findMany({ where: { id: { gte: 1 } }})
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


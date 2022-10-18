import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import {Markup, Scenes, Telegraf, Context } from "telegraf";
import LocalSession from 'telegraf-session-local';

interface MySessionScene extends Scenes.SceneSessionData {
  myProps: string;
}

interface MySession extends Scenes.SceneSession<MySessionScene> {
  myProp: string;
  myData: {
    preferenceType?: string,
  };
}

interface MyContext extends Context {
  props: string;
  session: MySession;
  scene: Scenes.SceneContextScene<MyContext, MySessionScene>;
}

const prisma = new PrismaClient();
const {leave, enter} = Scenes.Stage;

class App {
  async init() {
    const token = process.env.TOKEN;

    if (!token) {
      throw new Error('Не задан токен');
    }

    const scenarioTypeScene = new Scenes.BaseScene<MyContext>('SCENARIO_TYPE_SCENE_ID');

    scenarioTypeScene.enter((ctx) => {
      ctx.session.myData = {};
      ctx.reply('What is your drug?', Markup.keyboard(['Movie', 'Theater']));
    });

    scenarioTypeScene.action("Theater", (ctx) => {
      ctx.reply('You choose theater');
      ctx.session.myData.preferenceType = 'Theater';
      return ctx.scene.enter('SOME_OTHER_SCENE_ID'); // switch to some other scene
    });

    scenarioTypeScene.action('Movie', (ctx) => {
      ctx.reply('You choose movie, your loss');
      ctx.session.myData.preferenceType = 'Movie';
      return ctx.scene.leave(); // exit global namespace
    });

    scenarioTypeScene.leave((ctx) => {
      ctx.reply('Thank you for your time!');
    });

// What to do if user entered a raw message or picked some other option?
    scenarioTypeScene.use((ctx) => ctx.replyWithMarkdown('Please choose either Movie or Theater'));

    const bot = new Telegraf<MyContext>(token);

    const testScene = new Scenes.BaseScene<MyContext>('test');
    testScene.enter((ctx) => ctx.reply('Привет!'));
    testScene.command('back', leave<MyContext>());
    testScene.on('text', (ctx) => ctx.reply(ctx.message.text));

    testScene.leave((ctx) => ctx.reply('Пока!'));

    const stage = new Scenes.Stage<MyContext>([scenarioTypeScene, testScene])

    bot.use(new LocalSession({database: 'session.json'}).middleware());
    bot.use(stage.middleware());
    bot.use((ctx, next) => {
      ctx.session.myData.preferenceType;
      // ctx.session.myProp;
      ctx.scene.session.myProps;
      next();
    });

    bot.command('123', (ctx) => ctx.scene.enter('SCENARIO_TYPE_SCENE_ID'));
    bot.command('test', (ctx) => ctx.scene.enter('test'));

    // bot.command('/start', (ctx) => {
    //   const userName = ctx.message.from.first_name;
    //   ctx.reply(`Привет ${userName}!`);
    //   ctx.reply(`Напиши город`);
    // });
    //
    // bot.on('text', async (ctx) => {
    //   const userName = ctx.message.from.first_name;
    //   const userCity = ctx.message.text;
    //   const userId = ctx.from.id;
    //   const user = await prisma.user.findUnique({
    //     where: {
    //       userId,
    //     }
    //   })
    //   console.log(user);
    //   console.log(userCity);
    //   console.log(userName);
    //   // TODO добавить в schema.prisma id (ctx.from.id - number) чата и потом проверять на существование этого пользователя
    //   if (!user) {
    //     await prisma.user.create({
    //       data: {
    //         name: userName,
    //         city: userCity,
    //         userId,
    //       }
    //     });
    //   } else {
    //     console.log(userId);
    //     return;
    //   }
    // });


    bot.launch();
    await prisma.$connect();
    const allUsers = await prisma.user.findMany({ where: { id: { gte: 1 } }});
    const allActions = await prisma.action.findMany({ where: { id: { gte: 1 } }})
    console.log(allUsers)
    console.log(allActions)
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


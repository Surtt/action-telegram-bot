import 'dotenv/config';
import {Telegraf} from "telegraf";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class App {
  async init() {
    console.log(process.env)
    const token = process.env.TOKEN;

    if (!token) {
      throw new Error('Не задан токен');
    }

    const bot = new Telegraf(token);
    bot.command('/start', (ctx) => {
      const userName = ctx.message.from.first_name;
      ctx.reply(`Привет ${userName}!`);
    });

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


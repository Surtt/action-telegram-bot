import {Markup, Scenes} from "telegraf";
import {MyContext} from "../types";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUsersCategories = () => {
    const scene = new Scenes.BaseScene<MyContext>('getUsersCategories');
    scene.enter(async (ctx) => {
        const user = await prisma.user.findUnique({ where: { userId: ctx.session.userProp }});
        const buttons = user?.categories ? user?.categories.map((button) => {
            return Markup.button.callback(button, button);
        }) : []
        await ctx.reply('Нажмите на категорию, чтобы ее удалить', Markup.inlineKeyboard(buttons));
        user?.categories.forEach((category) => {
            // prisma.user.delete({ where: { categories: }})
            scene.action(category, (ctx) => ctx.reply(`Категория "${category}" удалена`));
        })
    });
    return scene;
}

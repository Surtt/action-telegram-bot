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
        }) : [];
        const isCategories = user?.categories.length ? 'Нажмите на категорию, чтобы ее удалить' : 'Вы не добавили ни одной категории /start'
        await ctx.reply(isCategories, Markup.inlineKeyboard(buttons));
        user?.categories.forEach((category) => {
            scene.action(category, async (ctx) => {
                const user = await prisma.user.findUnique({
                    where: {
                        userId: ctx.session.userProp
                    },
                    select: {
                        categories: true,
                }});
                await prisma.user.update({
                    where: {
                        userId: ctx.session.userProp,
                    },
                    data: {
                        categories: {
                            set: user?.categories.filter((cat: string) => cat !== category)
                        }
                    }
                })
                ctx.reply(`Категория "${category}" удалена`)
            });
        })
    });
    return scene;
}

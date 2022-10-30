import {Scenes} from "telegraf";
import {MyContext} from "../types";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const changeCityScene = () => {
    const scene = new Scenes.BaseScene<MyContext>('changeCity');
    scene.enter(async (ctx) => {
        await ctx.reply('Укажите, пожалуйста, новый город');
    });

    scene.on('text', async (ctx) => {
        const city = ctx.message.text;
        const userId = ctx.from.id;
        await prisma.user.update({
            where: { userId },
            data: {
                city,
            }
        });
        await ctx.reply('Город изменен');
        await ctx.scene.leave();
    });
    return scene;
}

import {Scenes} from "telegraf";
import {MyContext} from "../types";
import {getPrismaClient} from "../helpers/get-prisma-client.js";

export const changeCityScene = () => {
    const { prisma } = getPrismaClient();
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

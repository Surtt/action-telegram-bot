import {Markup, Scenes} from "telegraf";
import {MyContext} from "../types";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const settingsScene = () => {
    const scene = new Scenes.BaseScene<MyContext>('settings');
    scene.enter(async (ctx) => {
        const buttons = [
            Markup.button.callback('Изменить город', 'Изменить город'),
            Markup.button.callback('Изменить категории', 'Изменить категории'),
            Markup.button.callback('Мои категории', 'Мои категории'),
        ];
        await ctx.reply('Настройки', Markup.inlineKeyboard(buttons));
    });

    scene.action('Изменить город', (ctx) => ctx.scene.enter('changeCity'));
    scene.action('Мои категории', async (ctx) => {
        const user = await prisma.user.findUnique({ where: { userId: ctx.session.userProp }});
        const buttons = user?.categories ? user?.categories.map((button) => {
            return Markup.button.callback(button, button);
        }) : []
        await ctx.reply('Ваши категории', Markup.inlineKeyboard(buttons));
    });

    return scene;
}

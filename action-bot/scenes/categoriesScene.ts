import {Markup, Scenes} from "telegraf";
import {MyContext} from "../types";
import {getCategory} from "../helpers/getCategory.js";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const categoriesScene = () => {
    const scene = new Scenes.BaseScene<MyContext>('categories');
    scene.enter(async (ctx) => {
        const buttons = [
            Markup.button.callback('Курсы', 'Курсы'),
            Markup.button.callback('Одежда', 'Одежда'),
            Markup.button.callback('Электроника', 'Электроника'),
            Markup.button.callback('Продукты', 'Продукты')
        ];
        const user = await prisma.user.findUnique({ where: { userId: ctx.session.userProp }});

        // const filteredButtons = buttons.filter((button) => button && !user?.categories.includes(button));
        await ctx.reply('Выберите категории акций, которые вам интересны', Markup.inlineKeyboard(buttons));
    });

    scene.action('1', (ctx) => {
        console.log(ctx.callbackQuery.data);
    });

    scene.action('Курсы', getCategory);
    scene.action('Одежда', getCategory);
    scene.action('Электроника', getCategory);
    scene.action('Продукты', getCategory);
    return scene;
}

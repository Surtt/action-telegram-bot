import {Markup, Scenes} from "telegraf";
import {MyContext} from "../types";
import {getCategory} from "../helpers/get-category.js";
import {getPrismaClient} from "../helpers/get-prisma-client.js";

export const categoriesScene = () => {
    const { prisma } = getPrismaClient();
    const scene = new Scenes.BaseScene<MyContext>('categories');
    scene.enter(async (ctx) => {
        const buttons = ['Курсы', 'Одежда', 'Электроника', 'Продукты'];
        const user = await prisma.user.findUnique({ where: { userId: ctx.session.userProp }});

        const filteredButtons = buttons.filter((button) => button && !user?.categories.includes(button));
        await ctx.reply('Выберите категории акций, которые вам интересны', Markup.keyboard(filteredButtons).oneTime().resize());
    });

    scene.hears('Курсы', getCategory);
    scene.hears('Одежда', getCategory);
    scene.hears('Электроника', getCategory);
    scene.hears('Продукты', getCategory);
    return scene;
}

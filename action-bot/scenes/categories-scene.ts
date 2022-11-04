import {Markup, Scenes} from "telegraf";
import {MyContext} from "../types";
import {getCategory} from "../helpers/get-category.js";

export const categoriesScene = () => {
    const scene = new Scenes.BaseScene<MyContext>('categories');
    scene.enter(async (ctx) => {
        const buttons = [
            Markup.button.callback('Курсы', 'Курсы'),
            Markup.button.callback('Одежда', 'Одежда'),
            Markup.button.callback('Электроника', 'Электроника'),
            Markup.button.callback('Продукты', 'Продукты')
        ];

        await ctx.reply('Выберите категории акций, которые вам интересны', Markup.inlineKeyboard(buttons));
    });

    scene.action('Курсы', getCategory);
    scene.action('Одежда', getCategory);
    scene.action('Электроника', getCategory);
    scene.action('Продукты', getCategory);
    return scene;
}

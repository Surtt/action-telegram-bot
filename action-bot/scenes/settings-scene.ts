import {Markup, Scenes} from "telegraf";
import {MyContext} from "../types";


export const settingsScene = () => {
    const scene = new Scenes.BaseScene<MyContext>('settings');
    scene.enter(async (ctx) => {
        const buttons = [
            Markup.button.callback('Изменить город', 'Изменить город'),
            Markup.button.callback('Все категории', 'Все категории'),
            Markup.button.callback('Мои категории', 'Мои категории'),
        ];
        await ctx.reply('Настройки', Markup.inlineKeyboard(buttons));
    });

    scene.action('Изменить город', (ctx) => ctx.scene.enter('changeCity'));
    scene.action('Все категории', (ctx) => ctx.scene.enter('categories'));
    scene.action('Мои категории', (ctx) => ctx.scene.enter('getUsersCategories'));



    return scene;
}

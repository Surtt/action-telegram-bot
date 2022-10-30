import {Scenes} from "telegraf";
import {MyContext} from "../types";

export const greeterScene = () => {
    const scene = new Scenes.BaseScene<MyContext>("greeter");
    scene.enter( async (ctx) => {
        await ctx.reply(`Добрый день, ${ctx?.message?.from.first_name}!`)
        return await ctx.scene.enter('city');
    });
    return scene;
}

import {Scenes} from "telegraf";
import {MyContext} from "../types";
import {ScenesIds} from "./scenes-ids.js";

export const greeterScene = () => {
    const scene = new Scenes.BaseScene<MyContext>(ScenesIds.Greeter);
    scene.enter( async (ctx) => {
        await ctx.reply(`Добрый день, ${ctx?.message?.from.first_name}!`)
        return await ctx.scene.enter('city');
    });
    return scene;
}

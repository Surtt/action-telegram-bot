import {Markup, Scenes} from "telegraf";
import {MyContext} from "../types";
import {getCategory} from "../helpers/get-category.js";
import {ScenesIds} from "./scenes-ids.js";
import {PrismaClient} from "@prisma/client";

export const categoriesScene = (prisma: PrismaClient) => {
    const scene = new Scenes.BaseScene<MyContext>(ScenesIds.Categories);
    const getCategories = async () => await prisma.category.findMany();
    scene.enter(async (ctx) => {
        const categories = await getCategories();
        const buttons = categories
            .map((category) => Markup.button.callback(category.name, category.name));

        await ctx.reply('Выберите категории акций, которые вам интересны', Markup.inlineKeyboard(buttons));

        categories.forEach((category) => scene.action(category.name, getCategory))
    });

    return scene;
}

import {Scenes} from "telegraf";
import {MyContext} from "../types";
import {PrismaClient} from "@prisma/client";
import {ScenesIds} from "./scenes-ids.js";

export const cityScene = (prisma: PrismaClient) => {
    const scene = new Scenes.BaseScene<MyContext>(ScenesIds.City);
    scene.enter(async (ctx) => {
        const user = await prisma.user.findUnique({ where: { userId: ctx.session.userProp }});
        if (!user) {
            await ctx.reply('Укажите, пожалуйста, свой город');
        } else {
            return await ctx.scene.enter('categories');
        }
    });

    scene.on('text', async (ctx) => {
        const name = ctx.message.from.first_name;
        const city = ctx.message.text;
        const userId = ctx.from.id;
        const user = await prisma.user.findUnique({ where: { userId: ctx.session.userProp }});
        if (!user) {
            await prisma.user.create({
                data: {
                    name,
                    city,
                    userId,
                }
            });
            ctx.session.cityProp = city;
            return await ctx.scene.enter('categories');
        } else {
            return await ctx.scene.enter('categories');
        }
    });
    return scene;
}

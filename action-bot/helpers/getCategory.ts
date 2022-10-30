import dedent from "dedent-js";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCategory = async (ctx: any) => {
    const category = ctx.update.callback_query.data;
    const city = ctx.session.cityProp;
    const userCategories = await prisma.user.findUnique({ where: { userId: ctx.session.userProp}});
    const categories = userCategories?.categories;
    const getCategories = () => {
        if (!categories?.includes(category)) {
            return categories?.concat(category)
        } else {
            return;
        }
    }
    await prisma.user.update({ where: { userId: ctx.session.userProp}, data: { categories: getCategories()}})
    const actions = await prisma.action.findMany({ where: { category, city }});
    return actions.map((action) => {
        ctx.replyWithHTML(
            dedent`
          <b>📚 Название:</b> ${action.title}
          
          <b>💬 Описание:</b> ${action.text}
          
          <b>🏢 Город:</b> ${action.city}
          
          <b>🏁 Дата начала акции:</b> ${action.startDay.toLocaleDateString('ru-RU')}
          
          <b>🏁 Дата окончания акции:</b> ${action.endDay.toLocaleDateString('ru-RU')}
          
          <b>🏷 Теги:</b> ${action.tags.map((t) => `#${t}`).join(' ')}
          `);
    })
}

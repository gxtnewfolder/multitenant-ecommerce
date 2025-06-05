import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Category } from '@/payload-types';


export const categoriesRouter = createTRPCRouter({
    getMany: baseProcedure.query(async ({ ctx }) => {
        const data = await ctx.db.find({
            collection: 'categories',
            depth: 1,
            pagination: false,
            where: {
                parent: {
                    equals: false,
                },
            },
            sort: 'name',
        });

        const formattedData = data.docs.map((doc) => ({
            ...doc,
            subcategories: (doc.subcategories?.docs ?? []).map((subcat) => ({
                // Because of 'depth: 1' we are confident doc will be a Category
                ...(subcat as Category),
                subcategories: undefined,
            }))
        }));

        return formattedData;
    }),
});

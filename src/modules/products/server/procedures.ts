import { Category } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Sort, Where } from "payload";
import { z } from "zod";
import { sortValues } from "@/modules/products/search-params";

export const productsRouter = createTRPCRouter({
    getMany: baseProcedure
    .input(
        z.object({
        category: z.string().nullable().optional(),
        minPrice: z.string().nullable().optional(),
        maxPrice: z.string().nullable().optional(),
        tags: z.array(z.string()).nullable().optional(),
        sort: z.enum(sortValues).nullable().optional(),
    }))
    .query(async ({ ctx, input }) => {
        const where: Where = {};
        let sort: Sort = "-createdAt";

        if (input.sort === "curated") {
            sort = "-createdAt";
        }
        if (input.sort === "hot_and_new") {
            sort = "+createdAt";
        }
        if (input.sort === "trending") {
            sort = "-createdAt";
        }

        if (input.minPrice && input.maxPrice) {
            where.price = {
                greater_than_equal: input.minPrice,
                less_than_equal: input.maxPrice,
            }
        } else if (input.minPrice) {
            where.price = {
                greater_than_equal: input.minPrice,
            }
        } else if (input.maxPrice) {
            where.price = {
                less_than_equal: input.maxPrice,
            }
        }

        if (input.category) {
            const categoryData = await ctx.db.find({
                collection: 'categories',
                limit: 1,
                depth: 1,
                pagination: false,
                where: {
                    slug: {
                        equals: input.category, 
                    },
                },
            });

            const formattedData = categoryData.docs.map((doc) => ({
                ...doc,
                subcategories: (doc.subcategories?.docs ?? []).map((subcat) => ({
                    // Because of 'depth: 1' we are confident doc will be a Category
                    ...(subcat as Category),
                }))
            }));

            const subcategoriesSlugs = [];
            const parentCategory = formattedData[0];

            if (parentCategory) {
                subcategoriesSlugs.push(
                    ...(parentCategory.subcategories).map((subcat) => subcat.slug)
                );

                where["category.slug"] = {
                    in: [parentCategory.slug, ...subcategoriesSlugs]
                }
            }
        }

        if (input.tags && input.tags.length > 0) {
            where["tags.name"] = {
                in: input.tags
            };
        }

        const data = await ctx.db.find({
            collection: 'products',
            depth: 1, // Populate 'category', 'images'
            where,
            sort,
        });

        return data;

    }),
});

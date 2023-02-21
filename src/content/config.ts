import { z, defineCollection } from "astro:content";

const dateRegex = /(\d\d\d\d)-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)Z/;

function isDate(s: string) {
    const res = s.match(dateRegex);
    if (!res) return false;
    const date = new Date(res[0]);
    if (isNaN(date.getTime())) return false;
    const year = date.getFullYear();
    if (year < 2000 || year > 2999) return false; // All my posts are written this millennium and I don't think I'll live past 1013 years old.
    return true;
}

const blogCollection = defineCollection({
    schema: z.object({
        title: z.string(),
        tags: z.array(z.string()).optional(),
        timestamp: z.string().refine(isDate, {
            message: "Not a valid ISO UTC date this millennium.",
        }),
        description: z.string().optional(),
        draft: z.boolean().optional(),
    }),
});

export const collections = {
    posts: blogCollection,
};

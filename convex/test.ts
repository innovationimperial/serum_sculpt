import { query } from "./_generated/server";

export const test = query({
    args: {},
    handler: async (_ctx) => {
        return "Hello world";
    },
});

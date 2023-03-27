import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { yApiConfigStore } from "../yapi";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure.input(z.object({ text: z.string() })).query(({ input }) => {
    return {
      greeting: `Hello ${input.text}, ${yApiConfigStore.url}`,
    };
  }),

  update: publicProcedure
    .input(
      z.object({
        url: z.string(),
        token: z.string(),
      }),
    )
    .mutation(({ input }) => {
      yApiConfigStore.updateConfig(input.url, input.token);
    }),
});

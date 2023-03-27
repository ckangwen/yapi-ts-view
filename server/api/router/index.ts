import { exampleRouter } from "./example";
import { yApiRouter } from "./yapi";
import { createTRPCRouter } from "../trpc";

export const appRouter = createTRPCRouter({
  example: exampleRouter,
  yapi: yApiRouter,
});

export type AppRouter = typeof appRouter;

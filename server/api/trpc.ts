import { initTRPC, TRPCError } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import superjson from "superjson";
import { ZodError } from "zod";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  return {};
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure;

// const checkYapiConfig = t.middleware(({ next }) => {
//   console.log("checkYapiConfig", YAPI.url);
//   if (!YAPI.url && !YAPI.token) {
//     throw new TRPCError({
//       code: "UNAUTHORIZED",
//     });
//   }

//   return next();
// });

// export const yApiProcedure = t.procedure.use(checkYapiConfig);

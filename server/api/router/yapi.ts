import type { MenuProps } from "antd";
import { compile } from "json-schema-to-typescript";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { yApiConfigStore } from "../yapi";

type MenuTree = MenuProps["items"];

export const yApiRouter = createTRPCRouter({
  //= == config
  setConfig: publicProcedure
    .input(z.object({ url: z.string(), token: z.string() }))
    .mutation(async ({ input }) => {
      yApiConfigStore.updateConfig(input.url, input.token);

      return {
        url: yApiConfigStore.url,
        token: yApiConfigStore.token,
      };
    }),
  getConfig: publicProcedure.query(() => {
    return {
      url: yApiConfigStore.url,
      token: yApiConfigStore.token,
    };
  }),
  //= == function
  getCategoryTree: publicProcedure.input(z.number()).query(async ({ input }): Promise<MenuTree> => {
    const res = await yApiConfigStore.getCategoryTree(input);
    if (!res) return [];

    return res.map((item) => {
      return {
        key: item._id,
        label: item.name,
        children: item.list.map((child) => {
          return {
            key: child._id,
            label: child.title,
          };
        }),
      };
    });
  }),

  getInterface: publicProcedure.input(z.number()).query(async ({ input }) => {
    const res = await yApiConfigStore.getInterface(input);
    if (!res) {
      return {
        data: undefined,
        code: "",
      };
    }

    try {
      const code = await compile(res.res_body, "Response");

      return {
        data: res,
        code,
      };
    } catch (error) {
      console.error(error);
      return {
        data: undefined,
        code: "",
      };
    }
  }),
});

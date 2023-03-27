/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-underscore-dangle */
import axios, { AxiosInstance } from "axios";

import { tryJsonParse } from "utils/helper";

export interface YApiResponse<T = any> {
  errcode: number;
  errmsg: string;
  data: T;
}

type IsRequired = "0" | "1";
type RequestQueryType = "file" | "text";
type RequestBodyType = "file" | "form" | "json" | "raw";
type ResponseBodyType = "json" | "raw";
type InterfaceStatus = "done" | "undone";
type InterfaceMethod = "DELETE" | "GET" | "HEAD" | "OPTIONS" | "PATCH" | "POST" | "PUT";

export interface GetInterfaceResponse {
  query_path: {
    path: string;
    params: any[];
  };
  edit_uid: number;
  status: InterfaceStatus;
  type: string;
  req_body_is_json_schema: boolean;
  res_body_is_json_schema: boolean;
  api_opened: boolean;
  index: number;
  tag: string[];
  _id: number;
  method: InterfaceMethod;
  title: string;
  desc: string;
  path: string;
  req_params: {
    required: IsRequired;
    _id: string;
    name: string;
    type: RequestQueryType;
    desc: string;
  }[];
  req_body_form: {
    required: IsRequired;
    _id: string;
    name: string;
    type: RequestQueryType;
    desc: string;
  }[];
  req_headers: {
    required: IsRequired;
    _id: string;
    name: string;
    value: string;
    example: string;
  }[];
  req_query: {
    required: IsRequired;
    _id: string;
    name: string;
    type: RequestQueryType;
    desc: string;
  }[];
  req_body_type: RequestBodyType;
  res_body_type: ResponseBodyType;
  res_body: string;
  project_id: number;
  catid: number;
  uid: number;
  add_time: number;
  up_time: number;
  __v: number;
  username: string;
}
export type GetProjectCatMenu = {
  index: number;
  _id: number;
  name: string;
  project_id: number;
  desc: string;
  uid: number;
  add_time: number;
  up_time: number;
  __v: number;
}[];

type InterfaceData = {
  edit_uid: number;
  status: InterfaceStatus;
  api_opened: boolean;
  tag: string[];
  _id: number;
  method: InterfaceMethod;
  title: string;
  path: string;
  project_id: number;
  catid: number;
  uid: number;
  add_time: number;
};
export interface GetCategoryInterfaceList {
  count: number;
  total: number;
  list: InterfaceData[];
}

export interface GetCategoryListMenuItem {
  add_time: number;
  desc: string;
  index: number;
  name: string;
  project_id: number;
  uid: number;
  up_time: number;
  _id: number;
  list: InterfaceData[];
}

class YApiConfigStore {
  private $F: AxiosInstance | null = null;

  private _token = "";

  private _url = "";

  get token() {
    return this._token;
  }

  get url() {
    return this._url;
  }

  updateConfig(url: string, token: string) {
    if (url && token && url !== this.url && token !== this.token) {
      this._token = token;
      this._url = url;
      this.$F = axios.create({
        baseURL: url,
      });
    }
  }

  async getCategories(projectId: number): Promise<GetProjectCatMenu | undefined> {
    const [data, error] = await this.request<GetProjectCatMenu>(`/api/interface/getCatMenu`, {
      project_id: projectId,
    });

    if (!data) {
      console.error(error);
      return undefined;
    }

    return data;
  }

  async getCategoryTree(projectId: number): Promise<GetCategoryListMenuItem[] | undefined> {
    const [data, error] = await this.request<GetCategoryListMenuItem[]>(
      `/api/interface/list_menu`,
      {
        project_id: projectId,
      },
    );

    if (!data) {
      console.error(error);
      return undefined;
    }

    return data;
  }

  async getCategoryInterfaces(
    categoryId: number,
    page = 1,
    limit = 10,
  ): Promise<GetCategoryInterfaceList | undefined> {
    const [data, error] = await this.request<GetCategoryInterfaceList>(`/api/interface/list_cat`, {
      catid: categoryId,
      page,
      limit,
    });

    if (!data) {
      console.error(error);
      return undefined;
    }

    return data;
  }

  async getInterface(id: number): Promise<
    | (Omit<GetInterfaceResponse, "res_body"> & {
        res_body: Record<string, any>;
      })
    | undefined
  > {
    const [data, error] = await this.request<GetInterfaceResponse>(`/api/interface/get`, {
      id,
    });

    if (!data) {
      console.error(error);
      return undefined;
    }

    return {
      ...data,
      res_body: tryJsonParse(data.res_body, {}) as Record<string, any>,
    };
  }

  async getAllInterfaces(projectId: number): Promise<GetCategoryInterfaceList | undefined> {
    const [data, error] = await this.request<GetCategoryInterfaceList>(`/api/interface/list`, {
      project_id: projectId,
      page: 1,
      limit: 500,
    });

    if (!data) {
      console.error(error);
      return undefined;
    }

    return data;
  }

  private async request<D = unknown>(
    url: string,
    query: Record<string, any> = {},
  ): Promise<[D | undefined, Error | undefined, YApiResponse<D> | undefined]> {
    if (!this.$F) {
      return [undefined, new Error("请先配置YApi地址和Token"), undefined];
    }

    try {
      const result = await this.$F.request<YApiResponse<D>>({
        method: "GET",
        url,
        params: {
          token: this.token,
          ...query,
        },
      });

      return [result.data?.errcode === 0 ? result.data.data : undefined, undefined, result.data];
    } catch (error) {
      return [undefined, error as Error, undefined];
    }
  }
}

export const yApiConfigStore = new YApiConfigStore();

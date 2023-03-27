import { useEffect, useState } from "react";

import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";
import { useRouter } from "next/router";

import useYApiConfig from "hooks/useYApiConfig";
import { API } from "utils/api";

export default function Sidebar() {
  const router = useRouter();
  const context = API.useContext();

  const [current, setCurrent] = useState("");
  const { config: yApiConfig, ready: yApiReady, base64Config } = useYApiConfig();
  const [menus, setMenus] = useState<MenuProps["items"]>([]);

  useEffect(() => {
    if (yApiConfig.token && yApiConfig.url && yApiReady) {
      context.yapi.getCategoryTree.fetch(78).then((res) => {
        setMenus(res);
      });
    }
  }, [yApiConfig, yApiReady, context]);

  const onClick: MenuProps["onClick"] = (e) => {
    const { key } = e;
    setCurrent(key);
    router.push(`/interface/${key}?config=${base64Config}`);
  };

  return (
    <Layout.Sider
      width={200}
      style={{
        background: "#fff",
      }}
    >
      <Menu onClick={onClick} selectedKeys={[current]} mode="inline" items={menus} />
    </Layout.Sider>
  );
}

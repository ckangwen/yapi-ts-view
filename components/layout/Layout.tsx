import { ReactNode } from "react";

import { Layout } from "antd";

import Header from "./Header";
import Sidebar from "./Sidebar";

export default function GlobalLayout({ children }: { children: ReactNode }) {
  return (
    <Layout className="h-screen">
      <Header />
      <Layout>
        <Sidebar />
        <Layout className="px-5 pb-5 pt-0">
          <Layout.Content className="p-5 m-0 bg-white">{children}</Layout.Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
